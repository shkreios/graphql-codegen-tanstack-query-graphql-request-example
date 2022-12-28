import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, FC } from "react";
import { sdk } from "../graphqlClient";
import { isTruthy } from "../utils/isTruthy";

const Posts: FC<{
  setPostId: Dispatch<React.SetStateAction<string | null | undefined>>;
}> = ({ setPostId }) => {
  const queryClient = useQueryClient();
  const { status, data, error, isFetching } = useQuery(
    ["posts"],
    async ({ signal }) => {
      const { posts } = await sdk.GetPosts({}, signal);
      return posts?.data?.filter(isTruthy);
    }
  );

  return (
    <div>
      <h1>Posts</h1>
      <div>
        {status === "loading" ? (
          "Loading..."
        ) : status === "error" ? (
          <span>
            Error: {error instanceof Error ? error.message : `${error}`}
          </span>
        ) : (
          <>
            <div>
              {data?.map((post) => (
                <p key={post.id}>
                  <a
                    onClick={() => setPostId(post.id)}
                    href="#"
                    style={
                      // We can find the existing query data here to show bold links for
                      // ones that are cached
                      queryClient.getQueryData(["post", post.id])
                        ? {
                            fontWeight: "bold",
                            color: "green",
                          }
                        : {}
                    }
                  >
                    {post.title}
                  </a>
                </p>
              ))}
            </div>
            <div>{isFetching ? "Background Updating..." : " "}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Posts;
