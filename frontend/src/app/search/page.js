import SearchClient from './SearchClient';

// Server-side data fetching for initial random recipes
async function getRandomRecipes() {
  try {
    const recommendedResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/recipes/random`,
      { cache: 'no-store' }
    );

    if (!recommendedResponse.ok) {
      throw new Error('Failed to fetch recipes');
    }

    return await recommendedResponse.json();
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    return null;
  }
}

// Server component
export default async function Search() {
  const initialRecipes = await getRandomRecipes();
  
  return <SearchClient initialRecipes={initialRecipes} />;
}