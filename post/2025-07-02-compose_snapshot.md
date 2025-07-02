---
layout: post
title: "浅读Compose源码-Snapshot机制"
date: 2025-04-11 11:45:48 +0800
tag: "Compose|Android"
---

为了理解Compose的底层原理， 最近找了一些时间来阅读源码，这里记录一下自己的理解。

mutableStateOf可以声明一个状态， 当我们修改这个状态之后，所有依赖这个状态的Composable就会刷新。 
为什么给State赋值可以触发重组呢， 我们需要先理解Snapshot机制。
```kotlin
    val color = remember {
        mutableStateOf(Color.White)
    }

    color.state = Color.Blue
```

`mutableStateOf`初始化的类是`SnapshotMutableStateImpl`， 它是一个State
同时也是一个StateObject。

StateObject是一个链表，firstStateRecord是一个链表的表头。
成员变量`value`表示它也是一个state，我们发现它的getter和setter都代理给了`next`，所以对于value的访问就是操作这个链表。

```kotlin
internal open class SnapshotMutableStateImpl<T>(
    value: T,
    override val policy: SnapshotMutationPolicy<T>,
) : StateObjectImpl(), SnapshotMutableState<T> {

    override var value: T
        get() = next.readable(this).value
        set(value) =
            next.withCurrent {
                if (!policy.equivalent(it.value, value)) {
                    next.overwritable(this, it) { this.value = value }
                }
            }

    private var next: StateStateRecord<T> =
        currentSnapshot().let { snapshot ->
            StateStateRecord(snapshot.snapshotId, value).also {
                if (snapshot !is GlobalSnapshot) {
                    it.next = StateStateRecord(Snapshot.PreexistingSnapshotId.toSnapshotId(), value)
                }
            }
        }

    override val firstStateRecord: StateRecord
        get() = next
}
```

这个链表中的元素`StateRecord`都会和`snapshotId`绑定， 根据这个snapshotid就可以做到类似隔离的事务特性。

```kotlin
/** Snapshot local value of a state object. */
public abstract class StateRecord(
    /** The snapshot id of the snapshot in which the record was created. */
    internal var snapshotId: SnapshotId
) {
    internal var next: StateRecord? = null
}
```

看个例子:

`takeSnapshot`可以对当前global的Snapshot做一个快照，global的Snapshot和Nest的Snapshot不会互相影响。
`snapshot.enter`接受一个scope， 这个scope里的代码访问到的就是Nest的Snapshot了。state虽然被赋值为1，但是这个操作是对global snapshot做的， 不会影响最NestSnapshot中取得的值。

```kotlin
        var state by mutableStateOf<Int>(0)
        val snapshot = takeSnapshot()
        try {
            state = 1
            assertEquals(1, state)
            assertEquals(0, snapshot.enter { state })
        } finally {
            snapshot.dispose()
        }
```

那具体是如何实现的呢？

首先takeSnapshot方法会对GlobalSnapshot做一个快照。
开始时只有一个GlobalSnapshot， id为2

GlobalSnapshot(id: 2) 

当takeSnapshot后, 多了一个nestSnapshot，并且global的id增加1，状态为：

GlobalSnapshot(id: 4)

NestSnapshot(id: 3)

当给state赋值时， 访问到的是GlobalSnapshot， 会创建一个id为4的StateRecord，放在表头。链表状态为：

StateRecord(id: 4, value: 1) -> StateRecord(id: 2, value: 0)

然后这一行`snapshot.enter { state }`，
在NestSnapshot的scope里，访问state的值。
当前的Snapshot id是3，当遍历这个链表时， 取得的值都是比当前Snapshot id小的，所以不会取到链表头，而是取得了第二个StateRecord，值为0.
