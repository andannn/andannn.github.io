https://www.youtube.com/watch?v=2aOXH6XxARU

## Kernel

### System calls can be monitored by strace

指令： strace ./kio-benchmark 1> /dev/null

1> 的意思是，把stdout 重定向到 /dev/null



用kio的http server测试， 使用LinuxUring poller， 收到一次Http请求后， 执行的system call：

```
fcntl(5, F_GETFL)                       = 0x2 (flags O_RDWR)
fcntl(5, F_SETFL, O_RDWR|O_NONBLOCK)    = 0
write(1, "INFO  Server: Connection accepte"..., 33) = 33
write(1, "\n", 1)                       = 1
io_uring_enter(3, 2, 0, 0, NULL, 8)     = 2
write(1, "TRACE HTTP1: request head decode"..., 54) = 54
write(1, "\n", 1)                       = 1
write(1, "TRACE HTTP1: handled request suc"..., 37) = 37
write(1, "\n", 1)                       = 1
io_uring_enter(3, 1, 0, 0, NULL, 8)     = 1
write(1, "TRACE HTTP1: handled request fin"..., 38) = 38
write(1, "\n", 1)                       = 1
io_uring_enter(3, 1, 0, 0, NULL, 8)     = 1
io_uring_enter(3, 1, 0, 0, NULL, 8)     = 1
io_uring_enter(3, 0, 1, IORING_ENTER_GETEVENTS, NULL, 8) = 0
io_uring_enter(3, 1, 0, 0, NULL, 8)     = 1
io_uring_enter(3, 1, 0, 0, NULL, 8)     = 1
write(1, "INFO  Server: connection closed", 31) = 31
write(1, "\n", 1)                       = 1
io_uring_enter(3, 0, 1, IORING_ENTER_GETEVENTS, NULL, 8
```

可以看出， 每一个println都是两个systemcall， 这里需要优化



### You can read a Process's State form /proc

例如Knote的Pid是496787。进入/proc/496787文件夹， 执行:

```
$ cat status | grep State
State:  S (sleeping)
```

会返回process的状态。



### fork() system call

How fork() Works
- fork() creates a new child process.
- The child inherits a copy of the parent's virtual address space, including the stack, heap, and global variables.

- fork() returns the child's PID in the parent process and 0 in the child process.



### Child Process 2 possible status

![572](./7a1bea91-c690-4cc2-9635-741a5947831c)

#### 1. Zombi Process

A Zombie Process Waites for Its parent to read Its exit status

#### 2. Orphan Process

Parent Process exit and child process still alive



### Standard File Descriptor

0: stdin

1: stdout

2: stderr

We could close stanard input, freeing file descriptor0, and open a file, the kernal uses the lowest available file descriptor for a new one



### Standard File Descriptor redirect

```
$ ./program < 1.txt
```

make 1.txt as standard input(0) of `program` 

```
$ ./program > 1.txt
```

make 1.txt as standard output(1) of `program` 



### Pipe tow program

```
$ ./program1 | ./program2
```

make stdout of program1 as stdin of program2



### Signals interrupt

- Ctrl+C sends SIGINT(interrpt from keybord)

- kill <pid> sends SIGTERM(Termination) 

```
// register a signal handler
$ man 2 sigaction
```

Your process can be interrupted at any point in its execution, and process resumes after the signal handler finishes.



