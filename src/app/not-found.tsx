import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
      <div className="text-6xl font-bold text-muted-foreground">404</div>
      <h1 className="text-2xl font-semibold">页面不存在</h1>
      <p className="text-muted-foreground max-w-sm">
        你访问的工具或页面不存在，可能已被移除或链接有误。
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
      >
        返回首页
      </Link>
    </div>
  )
}
