import Request from './Request';

export default async function getProblemData(problemURL: string) {
  try {
    const result = await Request.get(`/crawler?url=${problemURL}`);
    return result.data;
  } catch (error) {
    console.error("Failed to fetch problem data:", error);
    return { error: 'Failed to fetch data' };
  }
}