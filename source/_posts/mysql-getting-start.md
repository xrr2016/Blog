---
title: MySQL 入门笔记 📒
categories:
  - 技术
tags:
  - MySQL
date: 2020-02-12 15:37:26
cover: https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80
---

工作需求学习一下 MySQL 数据库

<!--more-->

## 前言

什么是 MySQL？引用官方说明

> MySQL is the world's most popular open source database. Whether you are a fast growing web property, technology ISV or large enterprise, MySQL can cost-effectively help you deliver high performance, scalable database applications.
>
> MySQL 是世界上最受欢迎的开源数据库。无论您是快速增长的 Web 资产，技术 ISV 还是大型企业，MySQL 都能经济高效地帮助您交付高性能，可扩展的数据库应用程序。

MySQL 是目前最流行的关系型数据库，国内外很多公司都在使用，作为一个应用开发人员还是有必要学习一下 MySQL 的基本知识的。

## 基础操作

使用 Docker 运行一个 MySQL 容器

```s
docker run --name my-mysql -e MYSQL_ROOT_PASSWORD=1234 -d -v volume_folder -p 3306:3306 mysql:5
```

命令行登录 MySQL

```s
docker exec -it my-mysql bash
```

```s
mysql -u root -p
```

创建数据库
```sql
CREATE DATABASE db-name;
```

显示数据库列表
```sql
show databases;
```

选择数据库
```sql
use dbname;
```

显示数据表
```sql
show tables;
```

创建数据表
```sql
DROP TABLE IF EXISTS `user`;
CREATE TABLE user
(
    `id`                 bigint(11)   NOT NULL AUTO_INCREMENT,
    `user_id`            bigint(11)   NOT NULL COMMENT '用户id',
    `username`           varchar(45)  NOT NULL COMMENT '真实姓名',
    `email`              varchar(30)  NOT NULL COMMENT '用户邮箱',
    `nickname`           varchar(45)  NOT NULL COMMENT '昵称',
    `avatar`             int(11)      NOT NULL COMMENT '头像',
    `birthday`           date         NOT NULL COMMENT '生日',
    `gender`                tinyint(4)   DEFAULT '0' COMMENT '性别',
    `bio`    varchar(150) DEFAULT NULL COMMENT '一句话介绍自己，最多150个汉字',
    `user_resume`        varchar(300) NOT NULL COMMENT '用户提交的简历存放地址',
    `user_register_ip`   int          NOT NULL COMMENT '用户注册时的源ip',
    `create_time`        timestamp    NOT NULL COMMENT '用户记录创建的时间',
    `update_time`        timestamp    NOT NULL COMMENT '用户资料修改的时间',
    `user_review_status` tinyint      NOT NULL COMMENT '用户资料审核状态，1为通过，2为审核中，3为未通过，4为还未提交审核',
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_user_id` (`user_id`),
    KEY `idx_username` (`username`),
    KEY `idx_create_time` (`create_time`, `user_review_status`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT ='网站用户基本信息';
```

插入数据
```sql
INSERT INTO table_name ( field1, field2 ) VALUES ( value1, value2 );

INSERT INTO table_name SET field1=1,field2=2;
```

查询数据
```sql
SELECT username FROM table_name where id=1 limit 1;
```

更新数据
```sql
update table_name set username='update' where id=1;
```

删除数据
```sql
delete from table_name where id=1;
```

WHERE 有条件地从表中选取数据
```sql
SELECT field1, field2,...fieldN FROM table_name1, table_name2...
[WHERE condition1 [AND [OR]] condition2.....
```

LIKE 有条件地从表中选取数据
```sql
SELECT field1, field2,...fieldN
FROM table_name
WHERE field1 LIKE condition1 [AND [OR]] filed2 = 'somevalue'
```

UNION 连接 SELECT 语句的结果组合到一个结果集合中
```sql
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions]
UNION [ALL | DISTINCT]
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions];
```

JOIN 根据两个或多个表中的列之间的关系从中查询数据
```sql
SELECT Persons.LastName, Persons.FirstName, Orders.OrderNo
FROM Persons
INNER JOIN Orders
ON Persons.Id_P = Orders.Id_P
ORDER BY Persons.LastName;
```

查找表中多余的重复记录，重复记录是根据单个字段（peopleId）来判断
```sql
select * from people
where peopleId in (select peopleId from people group by peopleId having count(peopleId) > 1)
```

删除表中多余的重复记录，重复记录是根据单个字段（peopleId）来判断
```sql
delete from people
where peopleId in (select peopleId from people group by peopleId having count(peopleId) > 1)
```

显示数据表的结构
```sql
describe table_name;
```

添加列
```sql
alter table 表名 add 列名 列数据类型 [after 插入位置];
```

修改列
```sql
alter table 表名 change 列名称 列新名称 新数据类型;
```

删除列
```sql
alter table 表名 drop 列名称;
```

重命名表
```sql
alter table 表名 rename 新表名;
```

清空数据表
```sql
delete from table_name;
```

删除数据表
```sql
drop table table_name;
```

删除数据库
```sql
drop database dbname;
```

退出 MySQL
```sql
exit
```

## SQL 执行流程

1. 当客户端连接到MySQL服务器时，服务器对其进行认证。可以通过用户名与密码认证，也可以通过SSL证书进行认证。登录认证后，服务器还会验证客户端是否有执行某个查询的操作权限。
2. 在正式查询之前，服务器会检查查询缓存，如果能找到对应的查询，则不必进行查询解析，优化，执行等过程，直接返回缓存中的结果集。
3. MySQL的解析器会根据查询语句，构造出一个解析树，主要用于根据语法规则来验证语句是否正确，比如SQL的关键字是否正确，关键字的顺序是否正确。而预处理器主要是进一步校验，比如表名，字段名是否正确等
4. 查询优化器将解析树转化为查询计划，一般情况下，一条查询可以有很多种执行方式，最终返回相同的结果，优化器就是根据成本找到这其中最优的执行计划
5. 执行计划调用查询执行引擎，而查询引擎通过一系列API接口查询到数据
6. 得到数据之后，在返回给客户端的同时，会将数据存在查询缓存中

## 使用 MySQL

使用 DataGrip 链接 MySQL

![folder](/images/mysql-datagrip.jpg)

在 Egg.js 中使用 MySQL 数据库

```js
module.exports = () => {
  return {
    sequelize: {
      dialect: 'mysql',
      database: 'database-name',
      host: '127.0.0.1',
      port: '3306',
      username: 'root',
      password: 'my-secret-pw',
      pool: {
        max: 8, // 最大连接数
        min: 0, // 最小连接数
        idle: 10000, // connection释放前的最大空闲时间
      },
      timezone: '+08:00',
    },
  };
};

```

## MySQL 索引

MySQL 官方对索引的定义为：索引（Index）是帮助MySQL高效获取数据的数据结构。是针对表而建立的，它是由数据页面以外的索引页面组成，每个索引页中的行都含有逻辑指针，以便加速检索物理数据，创建索引的目的在于提高查询效率。

MyISAM

MyISAM 引擎使用 B+Tree 作为索引结构，叶节点的data域存放的是数据记录的地址。MyISAM 中索引检索的算法为首先按照 B+Tree 搜索算法搜索索引，如果指定的 Key 存在，则取出其 data 域的值，然后以 data 域的值为地址，读取相应数据记录。MyISAM的索引方式也叫做“非聚集”的，之所以这么称呼是为了与InnoDB的聚集索引区分。

InnoDB

在 InnoDB 中，表数据文件本身就是按B+Tree组织的一个索引结构，这棵树的叶节点data域保存了完整的数据记录。这个索引的key是数据表的主键，因此InnoDB表数据文件本身就是主索引。InnoDB 的辅助索引 data 域存储相应记录主键的值而不是地址。

创建使用索引的原则

1、索引尽量少，索引过多，影响写速度
2、建立索引尽量满足左匹配，索引只能命中最左边的范围查询，比如存在索引idx_a_b_c_d,  查询如select * from table where a=1 and b=2 and c>3 and d<4，则只能用到a,b,c
3、使用explain查看执行计划，需求所有的查询至少到达range级别
4、区分度不高的字段不建索引，比如性别，只有男和女，这种字段不需要建索引
5、表必须有主键索引，PRIMARY KEY (`id`)
6、建立索引时，把区分度高的字段放在前面

## 建表三范式

1. 要求有主键，并且要求每一个字段原子性不可再分
2. 第一范式基础上，要求所有非主键字段完全依赖主键，不能产生部分依赖
3. 在第二范式基础上，所有非主键字段和主键字段之间不能产生传递依赖

## 建表规范

命名规范

- 表名不使用复数名词
- 库名、表名、字段名使用小写字母，下划线 “_” 分割
- 库名、表名、字段名不超过 12 个字符
- 表名不使用复数名词
- 库名、表名、字段名见名知意, 尽量使用名词不是动词
- 不使用数据库保留字比如：key，desc，delete，order......
- 表的命名使用 "统一前缀_业务名称_表的作用" 模式，如：tb_plan, tb_task, tb_target

设计规范

- 使用布尔值类型存储是/否类字段
- 禁止在表中建立预留字段
- 所有表和字段都需添加注释
- 禁止在数据库存储图片、文件等二进制数据
- 存储引擎选择 InnoDB，表字符集选择 utf8mb4
- 将大字段拆分值其他表中
- 字段小写命名，禁止出现大写
- 尽可能把所有列定义为 NOT NULL，因为 NULL 在 MySQL 中得特殊处理、很难优化
- 优先选择符合存储需要的最小数据类型
- 对于非负整数，优先使用无符号整型存储（id）
- 避免使用 TEXT、BLOB 数据类型，非用不可的情况，可以把 BLOB 和 TEXT 拆分到单独的拓展表中
- 使用 TIMESTAMP 或 DATETIME 类型存储时间
  - TIMESTAMP（4BYTE）1970-01-01 00:00:01 - 2038-01-19 03:14:07
  - DATETIME（8BYTE）1000-01-01 00:00:00' -  9999-12-31 23:59:59
- 用 decimal 来存储金额字段，不要用 float 和 double，会出现数据精度丢失
- 使用 INT UNSIGNED 存储 IP，IP 转数字函数 inet_aton()、数字转 IP 函数 inet_ntoa()
- VARCHAR(N) 中的 N 表示字符数(不是字节数、比如 VARCHAR(N) 能存储 N 个汉字)、满足需求的情况下 N 越小越好、最大长度65535个字节
- 对于定长的字符类型、比如密码 MD5 值等、建议用 char 类型，效率可以得到提升




## 最佳实践

- Optimize Your Queries For the Query Cache
- EXPLAIN Your SELECT Queries
- LIMIT 1 When Getting a Unique Row
- Index the Search Fields
- Index and Use Same Column Types for Joins
- Avoid SELECT *
- Almost Always Have an id Field
- Use ENUM over VARCHAR
- Get Suggestions with PROCEDURE ANALYSE()
- Use NOT NULL If You Can
- Prepared Statements
- Unbuffered Queries
- Fixed-length(Static) Tables are Faster
- Vertical Partitioning
- Split the Big DELETE or INSERT Queries
- Smaller Columns Are Faster
- Choose the Right Storage Engine
- Use an Object Relational Mapper
- 在使用 InnoDB 存储引擎时，如果没有特别的需要，请永远使用一个与业务无关的自增字段作为主键。
- 禁止从开发环境、测试环境直连生产环境数据库

## 参考资料

[MySQL 教程](https://www.runoob.com/mysql/mysql-tutorial.html)

[数据库经验小结](https://www.kancloud.cn/xuying/sql/269824)

[21分钟MySQL基础入门](https://github.com/jaywcjlove/mysql-tutorial/blob/master/21-minutes-MySQL-basic-entry.md)

[MySql--数据库设计三范式](https://www.jianshu.com/p/3e97c2a1687b)

[MySQL索引背后的数据结构及算法原理](http://blog.codinglabs.org/articles/theory-of-mysql-index.html)

[Top 20+ MySQL Best Practices(20条MySQL最佳实践)](https://www.cnblogs.com/enein/archive/2012/11/29/2794896.html)
