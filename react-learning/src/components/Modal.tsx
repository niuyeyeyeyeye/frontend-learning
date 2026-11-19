// ============================================================
// components/Modal.tsx —— 可复用的弹窗（Portal + 5 个必做细节）
// ============================================================
// 📖 名字对照
//   Modal        弹窗容器
//   open         开/关
//   onClose      用户要求关闭时调用（点遮罩 / 按 Esc / 点关闭按钮）
//   title        标题（同时给 aria-labelledby 用）
//   createPortal 把 DOM 挂到 document.body
//
// ⭐ 一个"能用"的弹窗 = Portal + 这 5 件事（少一件都是 bug）：
//   ① createPortal 到 body（否则被父容器 overflow 裁掉 / z-index 失效）
//   ② 按 Esc 关闭
//   ③ 点遮罩关闭，但点弹窗内容不关闭
//   ④ 打开时锁住 body 滚动，关闭时恢复（写在 cleanup 里）
//   ⑤ 打开时把焦点移到弹窗里（不然 Tab 会跑到底下页面去）

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** 底部按钮区 */
  footer?: ReactNode
}

export default function Modal({ open, onClose, title, children, footer }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // ② Esc 关闭
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  // ④ 锁 body 滚动（cleanup 里一定要恢复，否则页面永远滚不动）
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // ⑤ 打开时聚焦到关闭按钮（无障碍：键盘用户要能操作弹窗）
  useEffect(() => {
    if (open) closeBtnRef.current?.focus()
  }, [open])

  if (!open) return null
  // SSR 安全：服务端没有 document
  if (typeof document === 'undefined') return null

  return createPortal(
    // ③ 点遮罩关闭 —— 用 mousedown + 判断 target 是遮罩本身（否则点内容也会关）
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.45)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          background: '#fff',
          borderRadius: 10,
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 8px 30px rgba(0,0,0,.25)',
          padding: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <strong id="modal-title" style={{ fontSize: 16 }}>
            {title}
          </strong>
          <button
            ref={closeBtnRef}
            className="btn-ghost"
            onClick={onClose}
            aria-label="关闭"
            style={{ marginLeft: 'auto', padding: '2px 8px' }}
          >
            ✕
          </button>
        </div>

        <div style={{ fontSize: 14, lineHeight: 1.7 }}>{children}</div>

        {footer !== undefined && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
