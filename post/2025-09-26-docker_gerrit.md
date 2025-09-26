---
layout: post
title: "用Docker 配置本地Gerrit服务"
date: 2025-09-26 11:45:48 +0800
tag: "Docker|Gerrit"
---

本地配置Gerrit服务，仅作为测试用途。

### Docker本地启动Gerrit服务

- 拉取镜像
```bash
docker pull gerritcodereview/gerrit
```

- 查看已下载的镜像
```bash
docker image ls
```

output:
```
gerritcodereview/gerrit 3.12.1-ubuntu24      abcd1234efgh   2 weeks ago    1.3GB
```

- 最基本的运行指令
```bash
docker run -ti -p 8080:8080 -p 29418:29418 gerritcodereview/gerrit
```
启动后可以打开gerrit服务
http://localhost:8080/

- 查看正在运行的Docker Container
```bash
docker ps
```

output:

```
CONTAINER ID   IMAGE                     COMMAND            CREATED         STATUS         PORTS                                                                                          NAMES
5c192897221c   gerritcodereview/gerrit   "/entrypoint.sh"   2 minutes ago   Up 2 minutes   0.0.0.0:8080->8080/tcp, [::]:8080->8080/tcp, 0.0.0.0:29418->29418/tcp, [::]:29418->29418/tcp   bold_khayyam
```

- docker compose 配置文件启动服务

docker-compose.yml
```yaml
services:
  gerrit:
    image: gerritcodereview/gerrit:3.12.1-ubuntu24
    container_name: gerrit
    ports:
      - "8080:8080"
      - "29418:29418"
    volumes:
      - ./gerrit/etc:/var/gerrit/etc
      - ./gerrit/git:/var/gerrit/git
      - ./gerrit/index:/var/gerrit/index
      - ./gerrit/cache:/var/gerrit/cache
      - ./gerrit/db:/var/gerrit/db
```
在docker-compose.yml所在路径下执行
```bash
docker compose up -d
```
-d 表示后台运行。

同样启动后可以打开gerrit服务。
http://localhost:8080/

同时，目录下多了gerrit文件夹，这个目录会挂载到容器里。
这样缓存和配置就能持久化了。 

具体映射:

/var/gerrit/etc：配置（gerrit.config、secure.config、replication.config 等）

/var/gerrit/git：Git 仓库

/var/gerrit/index：索引

/var/gerrit/cache：缓存

/var/gerrit/db：内置 H2 数据库（如果不用外部 DB）

- 关闭容器

```bash
docker compose down
```

- 进入容器

```bash
docker exec -it <ContainerID或者ContainerName> bash
```

p.s.
可以用 `docker ps` 查看运行的Docker Container，第一列是Container ID
， 最后一列是Container Name

### 修改Gerrit配置

- 修改认证方式为DEVELOPMENT_BECOME_ANY_ACCOUNT

gerrit/etc/gerrit.config
```config
[auth]
        type = DEVELOPMENT_BECOME_ANY_ACCOUNT
```
选项：
1. HTTP/反向代理认证
2. LDAP/Active Directory
3. OAuth（Google/GitHub/GitLab 等）
4. OpenID
5. DEVELOPMENT_BECOME_ANY_ACCOUNT 测试用途

然后重新启动容器，读取配置。
```bash
docker compose down
docker compose up -d
```

### 启动Jenkins Docker Container

// TEMP

用 Jenkins Credentials 管理私钥（不依赖容器文件）

1. 在宿主机生成一对 key：

```bash
ssh-keygen -t ed25519 -f ./jenkins-gerrit/id_ed25519 -C "jenkins"
```

2. 把 公钥（id_ed25519.pub）粘到 Gerrit：Settings → SSH Keys。

3. 在 Jenkins：Manage Jenkins → Credentials → Global → Add Credentials

 - Kind: SSH Username with private key

 - Username: 你的 Gerrit 用户名（如 Andannn/jenkins）

 - Private Key: Enter directly（粘贴 id_ed25519 私钥内容）

 - 保存后，在 Job/Server 配置里选这条凭据。

// TEMP
