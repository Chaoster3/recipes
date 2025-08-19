import Link from 'next/link';
import { ChefHat, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fde7cb] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <ChefHat className="w-12 h-12 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Recipe Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the recipe you're looking for. It might have been removed or the link might be incorrect.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Delish</span>
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Discover thousands of delicious recipes on our platform!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
