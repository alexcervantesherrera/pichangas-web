import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-red-700 font-bold text-lg mb-2">Error de la app</h2>
            <pre className="text-red-600 text-xs whitespace-pre-wrap bg-red-100 p-3 rounded">
              {this.state.error.message}
              {'\n'}
              {this.state.error.stack?.slice(0, 400)}
            </pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
