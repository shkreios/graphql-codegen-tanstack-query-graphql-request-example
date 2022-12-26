import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy, Suspense, useState } from "react";

const queryClient = new QueryClient();

const Posts = lazy(() => import("./components/posts"));
const Post = lazy(() => import("./components/post"));

export const App = () => {
  const [postId, setPostId] = useState<string | null | undefined>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <p>
        As you visit the posts below, you will notice them in a loading state
        the first time you load them. However, after you return to this list and
        click on any posts you have already visited again, you will see them
        load instantly and background refresh right before your eyes!{" "}
        <strong>
          (You may need to throttle your network speed to simulate longer
          loading sequences)
        </strong>
      </p>
      <Suspense fallback="Loading...">
        {!!postId ? (
          <Post postId={postId} setPostId={setPostId} />
        ) : (
          <Posts setPostId={setPostId} />
        )}
      </Suspense>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
