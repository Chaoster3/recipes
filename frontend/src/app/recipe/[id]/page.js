import { notFound } from 'next/navigation';
import { Clock, Users, ChefHat } from 'lucide-react';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${baseUrl}/recipes/${id}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      return {
        title: 'Recipe Not Found',
        description: 'The requested recipe could not be found.'
      };
    }

    const recipe = await res.json();
    
    return {
      title: recipe.title,
      description: recipe.summary?.replace(/<[^>]*>/g, '').substring(0, 160) || `Delicious recipe: ${recipe.title}`,
      openGraph: {
        title: recipe.title,
        description: recipe.summary?.replace(/<[^>]*>/g, '').substring(0, 160) || `Delicious recipe: ${recipe.title}`,
        images: [
          {
            url: recipe.image,
            width: 800,
            height: 600,
            alt: recipe.title,
          },
        ],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Recipe',
      description: 'Recipe details'
    };
  }
}

// Server-side data fetching
async function getRecipe(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${baseUrl}/recipes/${id}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

export default async function RecipePage({ params }) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fde7cb]">
      <div className="max-w-4xl mx-auto bg-white shadow-xl">
        {/* Header Section */}
        <div className="relative">
          <img
            src={recipe.image.replace(/-\w+\.(jpg|jpeg|png|gif)$/, '-636x393.$1')}
            alt={recipe.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
            <div className="absolute bottom-0 p-6 w-full">
              <h1 className="text-4xl font-bold text-white mb-4">{recipe.title}</h1>
              <div className="flex gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">{recipe.readyInMinutes || recipe.minutes} mins</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">{recipe.servings} servings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* About Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">About this Recipe</h2>
            <div className="prose prose-sm max-w-none text-gray-600">
              <p dangerouslySetInnerHTML={{ __html: recipe.summary }} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-orange-50/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.extendedIngredients?.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{ingredient.original}</span>
                  </li>
                )) || recipe.ingredients?.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{ingredient.original || ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.analyzedInstructions?.[0]?.steps?.map((step) => (
                  <li key={step.number} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                      {step.number}
                    </span>
                    <p className="text-sm text-gray-700 mt-0.5">{step.step}</p>
                  </li>
                )) || recipe.instructions?.[0]?.steps?.map((step) => (
                  <li key={step.number} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                      {step.number}
                    </span>
                    <p className="text-sm text-gray-700 mt-0.5">{step.step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center p-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
            <div className="mb-4">
              <ChefHat className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Love this recipe?</h3>
              <p className="text-gray-600 mb-6">
                Join Delish to save recipes, write reviews, and discover more delicious dishes!
              </p>
            </div>
            <a 
              href="/"
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
