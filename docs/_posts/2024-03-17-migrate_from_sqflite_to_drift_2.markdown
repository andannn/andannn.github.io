---
layout: post
title:  "Flutter中从Sqflite迁移到Drift（2）"
date:   2024-03-25 10:04:08 +0900
---

Drift的库可以用非常少的代码量来做到SQLite的数据库操作。
这归功于它利用了Dart的代码生成工具， 生成了所有的数据类和其辅助方法。
还有它给SqLite语法写了一层上层结构， 使得我们可以用链式调用的方法写Sql， 并且有了编译器的类型检查， 出错的可能性也大大降低。

### 代码生成

我们只需要像这样定义表结构。

```dart
@DataClassName('FavoriteInfoEntity')
class FavoriteInfoTable extends Table {
  IntColumn get id => integer().autoIncrement().named('favorite_info_id')();

  TextColumn get favoriteType => text().named('favorite_type')();

  TextColumn get infoId => text().named('favorite_info_foreign_id')();

  TextColumn get userId => text().named('favorite_user_id')();
}
```
然后执行build runner。
会生成3个类
- `$FavoriteInfoTableTable`它继承了`TableInfo`，是形容这个Table的类。
- `FavoriteInfoEntity`是数据库模块需要暴露给外部的数据类。 它实现了ToJson FromJson CopyWith这种普通数据类的功能。
- `FavoriteInfoTableCompanion`是我们操作数据库的辅助类。详细说下：

可以看到`FavoriteInfoTableCompanion`的每个成员都用一个`Value`包裹了一下， 
如果该项的值是`Value.absent()`的， 那么这项是不需要更新到表里的。

做数据库操作的的时候，很多情况下我们不需要对全部的Column进行更新， 为了实现部分更新， 我们大概率需要再写一个数据类， 叫ShortCut**Entity，
它对应了需要更新的部分。 这样定义很不灵活， 而Drift的Companion类完美的解决了这个问题。
```dart
class FavoriteInfoTableCompanion extends UpdateCompanion<FavoriteInfoEntity> {
  final Value<int> id;
  final Value<String> favoriteType;
  final Value<String> infoId;
  final Value<String> userId;
  const FavoriteInfoTableCompanion({
    this.id = const Value.absent(),
    this.favoriteType = const Value.absent(),
    this.infoId = const Value.absent(),
    this.userId = const Value.absent(),
  });
  FavoriteInfoTableCompanion.insert({
    this.id = const Value.absent(),
    required String favoriteType,
    required String infoId,
    required String userId,
  })  : favoriteType = Value(favoriteType),
        infoId = Value(infoId),
        userId = Value(userId);
  static Insertable<FavoriteInfoEntity> custom({
    Expression<int>? id,
    Expression<String>? favoriteType,
    Expression<String>? infoId,
    Expression<String>? userId,
  }) {
    return RawValuesInsertable({
      if (id != null) 'favorite_info_id': id,
      if (favoriteType != null) 'favorite_type': favoriteType,
      if (infoId != null) 'favorite_info_foreign_id': infoId,
      if (userId != null) 'favorite_user_id': userId,
    });
  }
}
```

### Dao
Dao层是暴露数据库给外部使用的类， 我们可以按功能把代码拆分开， 保证结构清晰。

Drift也给Dao层做了代码生成。如下是模版。
在注解中， 需要写出可以在该Dao中访问到的Table。 其他的表我们是没有访问权限的。
```dart
@DriftAccessor(tables: [
  ActivityTable,
  UserTable,
  MediaTable,
  ActivityFilterTypePagingCrossRefTable,
])
class ActivityDao extends DatabaseAccessor<AniflowDatabase2>
    with _$ActivityDaoMixin
```

### Sql写法
用Drift库需要我们具备Sql的知识。但是它给Sql做了一层封装， 大大减少了出错的可能性。

具体使用可以参照官网， 这里我只写一下迁移的例子：

sqflite:  需要写Sql， 然后从的JsonMap中解析出我们需要的数据类。
```dart
  @override
  Future<List<CharacterAndVoiceActorRelationEntity>> getCharacterOfMediaByPage(
      String animeId,
      {required int page,
      StaffLanguage staffLanguage = StaffLanguage.japanese,
      int perPage = AfConfig.defaultPerPageCount}) async {
    final int limit = perPage;
    final int offset = (page - 1) * perPage;
    final characterSql = 'select * from ${Tables.characterTable} as c \n'
        'join ${Tables.mediaCharacterCrossRefTable} as ac '
        '  on c.${CharacterColumns.id} = ac.${MediaCharacterCrossRefColumns.characterId} \n'
        'left join ${Tables.characterVoiceActorCrossRefTable} as cv \n'
        '  on c.${CharacterColumns.id} = cv.${CharacterVoiceActorCrossRefColumns.characterId} \n'
        '    and cv.${CharacterVoiceActorCrossRefColumns.language} = \'${staffLanguage.toJson()}\' \n'
        'left join ${Tables.staffTable} as v \n'
        '  on cv.${CharacterVoiceActorCrossRefColumns.staffId} = v.${StaffColumns.id} \n'
        'where ac.${MediaCharacterCrossRefColumns.mediaId} = \'$animeId\' \n'
        'order by ${MediaCharacterCrossRefColumns.timeStamp} asc \n'
        'limit $limit \n'
        'offset $offset \n';
    List<Map<String, dynamic>> characterResults =
        await database.aniflowDB.rawQuery(characterSql);
    return characterResults
        .map(
          (e) => CharacterAndVoiceActorRelationEntity(
            characterEntity: CharacterEntity.fromJson(e),
            voiceActorEntity: StaffEntity.fromJson(e),
            language: StaffLanguage.fromJson(
                e[CharacterVoiceActorCrossRefColumns.language]),
            role: CharacterRole.fromJson(
                e[CharacterVoiceActorCrossRefColumns.role]),
          ),
        )
        .toList();
  }
```

Drift：用Drift提供的方法来写Sql， 并用`readTable`方法来取得数据类。

Drift的代码看起来模式和Sqflite一模一样， 可以0成本迁移过来。
而且可以避免很多错误。

比如`characterVoiceActorCrossRefTable`这个表是用个LeftJoin连接的， 最终该表的结果可能是null。
我们需要用`row.readTableOrNull(staffTable)`方法来读取数据类， 不然会报错。

```dart
  Stream<List<CharacterAndVoiceActorRelation>> getCharacterListStream(
      String mediaId,
      {int count = 12,
      required String staffLanguage}) {
    final query = select(characterTable).join([
      innerJoin(mediaCharacterPagingCrossRefTable, characterTable.id.equalsExp(mediaCharacterPagingCrossRefTable.characterId)),
      leftOuterJoin(
        characterVoiceActorCrossRefTable,
        characterTable.id.equalsExp(characterVoiceActorCrossRefTable.characterId) & characterVoiceActorCrossRefTable.language.equals(staffLanguage),
      ),
      leftOuterJoin(staffTable, characterVoiceActorCrossRefTable.staffId.equalsExp(staffTable.id)),
    ])
      ..where(mediaCharacterPagingCrossRefTable.mediaId.equals(mediaId))
      ..orderBy(
          [OrderingTerm.asc(mediaCharacterPagingCrossRefTable.timeStamp)])
      ..limit(limit, offset: offset);


    return (query.map(
      (row) => CharacterAndVoiceActorRelation(
        characterEntity: row.readTable(characterTable),
        voiceActorEntity: row.readTableOrNull(staffTable),
        staffLanguage: row.read(characterVoiceActorCrossRefTable.language),
        characterRole: row.read(characterVoiceActorCrossRefTable.role),
      ),
    )).watch();
  }
```
