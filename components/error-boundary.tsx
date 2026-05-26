'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children?: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-white">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-3 animate-pulse" />
          <h2 className="text-xl font-bold mb-2">عذراً، حدث خطأ غير متوقع</h2>
          <p className="text-sm text-white/60 mb-4 max-w-md">
            {this.state.error?.message || 'تعذر تحميل هذا الجزء من الصفحة'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-bold transition-all cursor-pointer"
          >
            إعادة المحاولة
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
