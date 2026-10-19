---
layout: post
title: "用Docker 配置本地Jenkins与Gerrit Trigger服务"
date: 2025-09-27 21:45:48 +0800
tag: "Docker|Gerrit|Jenkins"
---

# Jenkins 配置 Gerrit Server 文档

## 1. 前提条件
- Jenkins 运行在 Docker 容器中（镜像：`jenkins/jenkins:lts`）。
- Gerrit 运行在 Docker 容器中（镜像：`gerritcodereview/gerrit:3.12.1-ubuntu24`）。
- Jenkins 与 Gerrit 在同一个 Docker 自定义网络中，可以通过容器名互相访问。
- 已生成 SSH Key（推荐 `ed25519`），公钥已添加到 Gerrit 用户的 **SSH Keys**。

---

## 2. Docker Compose 示例

```yaml
version: "3.8"
services:
  gerrit:
    image: gerritcodereview/gerrit:3.12.1-ubuntu24
    container_name: gerrit
    ports:
      - "8080:8080"     # Gerrit Web UI
      - "29418:29418"   # Gerrit SSH
    volumes:
      - ./gerrit/etc:/var/gerrit/etc
      - ./gerrit/git:/var/gerrit/git
      - ./gerrit/index:/var/gerrit/index
      - ./gerrit/cache:/var/gerrit/cache
      - ./gerrit/db:/var/gerrit/db
    networks:
      - ci

  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
    restart: always
    user: root
    ports:
      - "8081:8080"     # Jenkins Web UI
      - "50000:50000"
    volumes:
      - ./jenkins:/var/jenkins_home
      - ./jenkins/ssh:/var/jenkins_home/.ssh
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - ci

networks:
  ci:
    driver: bridge
```

## 3. SSH Key 配置

### 3.1 生成 SSH Key
在宿主机生成 SSH Key：

```bash
ssh-keygen -t ed25519 -C "jenkins-bot"
```
会生成：

 - 私钥：id_ed25519

 - 公钥：id_ed25519.pub

### 3.2 配置 Gerrit 公钥

进入 Gerrit Web 界面：

1. 登录 Gerrit

2. 打开 Settings → SSH Keys

3. 将 id_ed25519.pub 文件内容复制进去

4. 点击保存


## 4. Jenkins UI 配置 Gerrit Server

路径：**Manage Jenkins → Gerrit Trigger → Gerrit Servers**

- **Name**: `gerrit-main`
- **Frontend URL**: `http://gerrit:8080/`
- **Gerrit Hostname**: `gerrit`
- **Gerrit SSH Port**: `29418`
- **Gerrit Username**: `jenkins`（你的 Gerrit 用户名）
- **SSH Keyfile**: `/var/jenkins_home/.ssh/id_ed25519`
- **Connection Type**: `SSH`
- **Test Connection**: 确认成功。

---

## 5. 权限配置（Gerrit 端）

在 Gerrit 中给 Jenkins 用户分配：

- `Read` 权限
- `Label: Verified -1..+1`（允许 Jenkins 投票）

---

## 6. 常见问题

- **Missed Events Playback not supported**  
  - 说明 Gerrit 没装 `events-log` 插件，导致断线后事件无法补偿。  
  - 基础功能不受影响，可忽略。  
  - 如果需要高可用，需在 Gerrit 安装 `events-log` 插件并开启 REST API。

- **Test Connection 失败**  
  - 检查 Jenkins 与 Gerrit 是否在同一网络（`ci`）。  
  - 确认 Hostname 用 `gerrit` 而不是 `localhost`。  
  - 检查私钥和公钥是否匹配。

---


## 7. 配置Jenkins Credentials

1. 复制容器内可用私钥全文（必须包含上下首尾行）：
- 开头：-----BEGIN OPENSSH PRIVATE KEY-----

 - 中间：多行 base64，原样保留

 - 结尾：-----END OPENSSH PRIVATE KEY-----

```bash
docker exec -u jenkins -it jenkins bash -lc 'cat ~/.ssh/id_ed25519'
```

2. Manage Jenkins → Credentials → System → Global → Add Credentials

 - Kind：SSH Username with private key

- Username：<你的Gerrit用户名>

- Private Key：Enter directly（粘贴上一步完整私钥，包含首尾行）

- Passphrase：留空（若密钥无口令；有口令则填写）

- ID：gerrit-bot-key

