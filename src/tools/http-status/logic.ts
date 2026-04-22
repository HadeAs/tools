export interface StatusCode {
  code: number
  name: string
  description: string
  category: '1xx' | '2xx' | '3xx' | '4xx' | '5xx'
}

export const STATUS_CODES: StatusCode[] = [
  { code: 100, name: 'Continue',                        description: '服务器已收到请求头，客户端应继续发送请求体',                 category: '1xx' },
  { code: 101, name: 'Switching Protocols',             description: '服务器正在切换协议（如升级到 WebSocket）',                  category: '1xx' },
  { code: 102, name: 'Processing',                      description: '服务器已收到请求并正在处理，尚无响应可用',                   category: '1xx' },
  { code: 103, name: 'Early Hints',                     description: '用于在最终响应之前发送预加载链接头',                         category: '1xx' },
  { code: 200, name: 'OK',                              description: '请求成功',                                                    category: '2xx' },
  { code: 201, name: 'Created',                         description: '请求成功，新资源已创建',                                      category: '2xx' },
  { code: 202, name: 'Accepted',                        description: '请求已接受，但处理尚未完成',                                  category: '2xx' },
  { code: 203, name: 'Non-Authoritative Information',   description: '请求成功，但返回的信息来自第三方缓存副本',                    category: '2xx' },
  { code: 204, name: 'No Content',                      description: '请求成功，响应不包含内容',                                    category: '2xx' },
  { code: 205, name: 'Reset Content',                   description: '请求成功，要求客户端重置文档视图',                            category: '2xx' },
  { code: 206, name: 'Partial Content',                 description: '服务器成功处理了部分 GET 请求（用于断点续传）',               category: '2xx' },
  { code: 207, name: 'Multi-Status',                    description: '多状态，包含多个独立操作的状态（WebDAV）',                    category: '2xx' },
  { code: 301, name: 'Moved Permanently',               description: '资源已永久移动到新 URL',                                      category: '3xx' },
  { code: 302, name: 'Found',                           description: '资源临时移动到另一个 URL',                                    category: '3xx' },
  { code: 303, name: 'See Other',                       description: '响应可在另一个 URI 用 GET 请求获取',                          category: '3xx' },
  { code: 304, name: 'Not Modified',                    description: '资源未修改，客户端可使用缓存版本',                            category: '3xx' },
  { code: 307, name: 'Temporary Redirect',              description: '资源临时重定向，请求方法和请求体不变',                        category: '3xx' },
  { code: 308, name: 'Permanent Redirect',              description: '资源永久重定向，请求方法和请求体不变',                        category: '3xx' },
  { code: 400, name: 'Bad Request',                     description: '请求语法错误或参数无效',                                      category: '4xx' },
  { code: 401, name: 'Unauthorized',                    description: '需要身份验证才能访问',                                        category: '4xx' },
  { code: 402, name: 'Payment Required',                description: '需要付款（保留用于未来使用）',                                category: '4xx' },
  { code: 403, name: 'Forbidden',                       description: '服务器拒绝执行请求，权限不足',                                category: '4xx' },
  { code: 404, name: 'Not Found',                       description: '请求的资源不存在',                                            category: '4xx' },
  { code: 405, name: 'Method Not Allowed',              description: '请求方法不被目标资源允许',                                    category: '4xx' },
  { code: 406, name: 'Not Acceptable',                  description: '服务器无法生成符合客户端 Accept 头的响应',                    category: '4xx' },
  { code: 407, name: 'Proxy Authentication Required',   description: '需要通过代理服务器进行身份验证',                              category: '4xx' },
  { code: 408, name: 'Request Timeout',                 description: '请求超时，服务器关闭了空闲连接',                              category: '4xx' },
  { code: 409, name: 'Conflict',                        description: '请求与服务器当前状态冲突',                                    category: '4xx' },
  { code: 410, name: 'Gone',                            description: '资源已永久删除，不再可用',                                    category: '4xx' },
  { code: 411, name: 'Length Required',                 description: '请求缺少 Content-Length 头',                                  category: '4xx' },
  { code: 412, name: 'Precondition Failed',             description: '请求头中的前提条件不满足',                                    category: '4xx' },
  { code: 413, name: 'Content Too Large',               description: '请求体超过服务器允许的最大大小',                              category: '4xx' },
  { code: 414, name: 'URI Too Long',                    description: 'URI 超过服务器允许的最大长度',                                category: '4xx' },
  { code: 415, name: 'Unsupported Media Type',          description: '请求的媒体格式不受支持',                                      category: '4xx' },
  { code: 416, name: 'Range Not Satisfiable',           description: '请求的范围无法满足',                                          category: '4xx' },
  { code: 417, name: 'Expectation Failed',              description: 'Expect 请求头中的期望无法被服务器满足',                       category: '4xx' },
  { code: 418, name: "I'm a teapot",                    description: '服务器拒绝用茶壶泡咖啡（RFC 2324 彩蛋）',                    category: '4xx' },
  { code: 422, name: 'Unprocessable Entity',            description: '请求格式正确但语义错误，无法处理',                            category: '4xx' },
  { code: 423, name: 'Locked',                          description: '请求的资源已被锁定（WebDAV）',                                category: '4xx' },
  { code: 425, name: 'Too Early',                       description: '服务器不愿意处理可能被重放的请求',                            category: '4xx' },
  { code: 426, name: 'Upgrade Required',                description: '客户端需要升级到其他协议',                                    category: '4xx' },
  { code: 428, name: 'Precondition Required',           description: '服务器要求请求是有条件的',                                    category: '4xx' },
  { code: 429, name: 'Too Many Requests',               description: '客户端请求过于频繁，触发限流',                                category: '4xx' },
  { code: 431, name: 'Request Header Fields Too Large', description: '请求头字段过大',                                              category: '4xx' },
  { code: 451, name: 'Unavailable For Legal Reasons',   description: '因法律原因，资源不可访问',                                    category: '4xx' },
  { code: 500, name: 'Internal Server Error',           description: '服务器内部发生未知错误',                                      category: '5xx' },
  { code: 501, name: 'Not Implemented',                 description: '服务器不支持完成请求所需的功能',                              category: '5xx' },
  { code: 502, name: 'Bad Gateway',                     description: '网关或代理从上游服务器收到无效响应',                          category: '5xx' },
  { code: 503, name: 'Service Unavailable',             description: '服务器暂时不可用，通常因过载或维护',                          category: '5xx' },
  { code: 504, name: 'Gateway Timeout',                 description: '网关或代理等待上游服务器响应超时',                            category: '5xx' },
  { code: 505, name: 'HTTP Version Not Supported',      description: '服务器不支持请求中使用的 HTTP 版本',                          category: '5xx' },
  { code: 507, name: 'Insufficient Storage',            description: '服务器存储空间不足，无法完成请求',                            category: '5xx' },
  { code: 508, name: 'Loop Detected',                   description: '服务器检测到请求处理中的无限循环（WebDAV）',                  category: '5xx' },
  { code: 511, name: 'Network Authentication Required', description: '客户端需要通过网络认证才能访问（如 Wi-Fi 登录）',            category: '5xx' },
]

export const CATEGORY_COLORS: Record<StatusCode['category'], string> = {
  '1xx': 'text-blue-500 bg-blue-500/10',
  '2xx': 'text-green-500 bg-green-500/10',
  '3xx': 'text-yellow-500 bg-yellow-500/10',
  '4xx': 'text-orange-500 bg-orange-500/10',
  '5xx': 'text-red-500 bg-red-500/10',
}

export function searchStatus(query: string): StatusCode[] {
  const q = query.trim().toLowerCase()
  if (!q) return STATUS_CODES
  return STATUS_CODES.filter(s =>
    String(s.code).startsWith(q) ||
    s.name.toLowerCase().includes(q) ||
    s.description.includes(q)
  )
}
