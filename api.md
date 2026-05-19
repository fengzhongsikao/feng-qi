中华诗词接口
请求地址  https://poetry.palemoky.com/
<!--获取作者 -->
/api/authors

自己接口
## 接口总览

请求地址 http://122.51.104.131:8000

| 接口 | 方法 | 说明 |
|------|------|------|
| `GET /api/poems` | 列表 | 分页获取诗词列表 |
| `GET /api/poems/search` | 搜索 | 按作者/标题/正文关键词搜索 |
| `GET /api/poems/random` | 随机 | 从唐诗三百首中随机返回一首 |
---
## 返回结构说明

所有列表接口返回统一格式：

```json
{
  "total": 1000,
  "page": 1,
  "page_size": 20,
  "data": [
    {
      "id": "08e41396-2809-423d-9bbc-1e6fb24c0ca1",
      "title": "日詩",
      "author": "宋太祖",
      "paragraphs": [
        "欲出未出光辣達，千山萬山如火發。",
        "須臾走向天上來，逐却殘星趕却月。"
      ]
    }
  ]
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `total` | int | 符合条件的总条数 |
| `page` | int | 当前页码 |
| `page_size` | int | 每页条数 |
| `data` | array | 诗词数据列表 |
| `data[].id` | string | 诗词唯一 ID |
| `data[].title` | string | 标题 |
| `data[].author` | string | 作者 |
| `data[].paragraphs` | array | 正文（每句为数组中的一项） |

---

## 1. 获取诗词列表

```
GET /api/poems
```

### 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `page` | int | 否 | 1 | 页码，从 1 开始 |
| `page_size` | int | 否 | 20 | 每页条数，范围 1-100 |

### 示例

```bash
# 获取第 1 页，每页 20 条
GET /api/poems

# 获取第 3 页，每页 10 条
GET /api/poems?page=3&page_size=10
```

### 加载下一页

前端只需要将 `page` 参数 +1 即可：

```javascript
// 第一页
const res1 = await fetch('/api/poems?page=1&page_size=20')
const data1 = await res1.json()
// data1.total 是总条数

// 第二页
const res2 = await fetch(`/api/poems?page=2&page_size=20`)
const data2 = await res2.json()

// 判断是否还有更多
const hasMore = data1.page * data1.page_size < data1.total
```

---

## 2. 搜索诗词

```
GET /api/poems/search
```

### 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `author` | string | 否 | null | 作者名（模糊匹配） |
| `title` | string | 否 | null | 诗词标题（模糊匹配） |
| `keyword` | string | 否 | null | 正文关键词（模糊匹配） |
| `page` | int | 否 | 1 | 页码 |
| `page_size` | int | 否 | 20 | 每页条数 |

以上搜索参数可任意组合，同时传入多个条件时为 **"与"关系**。

### 示例

```bash
# 按作者搜索
GET /api/poems/search?author=李白

# 按标题搜索
GET /api/poems/search?title=将进酒

# 按正文关键词搜索
GET /api/poems/search?keyword=明月

# 组合搜索（李白诗中含"明月"）
GET /api/poems/search?author=李白&keyword=明月

# 组合搜索带分页
GET /api/poems/search?author=杜甫&title=春&page=2&page_size=10
```

### 前端调用示例

```javascript
// 搜索作者
const res = await fetch(`/api/poems/search?author=${encodeURIComponent('李白')}`)
const data = await res.json()

// 搜索标题
const res = await fetch(`/api/poems/search?title=${encodeURIComponent('将进酒')}`)

// 搜索正文关键词
const res = await fetch(`/api/poems/search?keyword=${encodeURIComponent('天生我材')}`)

// 组合搜索 + 分页
const author = '李白'
const keyword = '明月'
const page = 1
const res = await fetch(
  `/api/poems/search?author=${encodeURIComponent(author)}&keyword=${encodeURIComponent(keyword)}&page=${page}&page_size=20`
)
```

---

## 3. 随机一首诗词

```
GET /api/poems/random
```

### 请求参数

无。

### 示例

```bash
GET /api/poems/random
```

### 返回示例

```json
{
  "id": "51b1aeeb-9a66-412d-b15c-4afaa6c6b1d7",
  "title": "漁翁",
  "author": "柳宗元",
  "paragraphs": [
    "漁翁夜傍西巖宿，曉汲清湘燃楚竹。",
    "煙銷日出不見人，欸乃一聲山水綠。",
    "回看天際下中流，巖上無心雲相逐。"
  ]
}
```

### 前端调用示例

```javascript
const res = await fetch('/api/poems/random')
const poem = await res.json()
// poem.title, poem.author, poem.paragraphs
```