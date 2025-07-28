import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <h2 className="text-6xl font-bold text-gray-400 mb-4">404</h2>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">页面未找到</h3>
                <p className="text-gray-600 mb-6">
                    您访问的页面不存在。
                </p>
                <Link
                    href="/"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
                >
                    返回首页
                </Link>
            </div>
        </div>
    );
}