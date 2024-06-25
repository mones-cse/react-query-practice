import "./App.css";
import {
  useQuery,
  useMutation,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";

const POSTS = [
  { id: 1, title: "Post 1" },
  { id: 2, title: "Post 2" },
  { id: 3, title: "Post 3" },
];
function App() {
  console.log(POSTS);
  const queryClient = useQueryClient();
  const postQuery = useQuery({
    queryKey: ["posts"],
    // checking if the query is failed
    // queryFn: () => Promise.reject("Error message"),
    queryFn: () => wait(1000).then(() => [...POSTS]),
  });

  const newPostMutation = useMutation({
    mutationFn: async (title: string) => {
      await wait(1000);
      return POSTS.push({ id: POSTS.length + 1, title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"] as InvalidateQueryFilters);
    },
  });

  if (postQuery.isLoading) {
    return <h1>Loading...</h1>;
  }
  if (postQuery.isError) {
    return <h1>Error: {JSON.stringify(postQuery.error)}</h1>;
  }

  return (
    <>
      <h1>TanStack Query!!</h1>
      <ul>
        {postQuery.data?.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <button
        onClick={() => newPostMutation.mutate("New Post")}
        disabled={newPostMutation.isPending}
      >
        New Post
      </button>
    </>
  );
}

function wait(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

export default App;
