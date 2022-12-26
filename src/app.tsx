import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
  QueryFunction,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { request, GraphQLClient } from "graphql-request";
import { Dispatch, FC, useMemo, useState } from "react";
import { isTruthy } from "./utils/isTruthy";
import { graphql } from "./gql/gql";

const endpoint = "https://graphqlzero.almansi.me/api";

const queryClient = new QueryClient();

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
      {!!postId ? (
        <Post postId={postId} setPostId={setPostId} />
      ) : (
        <Posts setPostId={setPostId} />
      )}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

const graphQLClient = new GraphQLClient(endpoint, {});

const getPosts = (async ({ signal }) => {
  const res = await graphQLClient.request({
    document: graphql(/* GraphQL */ `
      query Posts {
        posts {
          data {
            id
            title
          }
        }
      }
    `),
    signal,
  });
  return res.posts?.data?.filter(isTruthy);
}) satisfies QueryFunction<unknown, string[]>;

const Posts: FC<{
  setPostId: Dispatch<React.SetStateAction<string | null | undefined>>;
}> = ({ setPostId }) => {
  const queryClient = useQueryClient();
  const { status, data, error, isFetching } = useQuery(["posts"], getPosts);

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

const getPost = (async ({ signal, queryKey }) => {
  const { post } = await request(
    endpoint,
    graphql(/* GraphQL */ `
      query Post($id: ID!) {
        post(id: $id) {
          id
          title
          body
        }
      }
    `),
    {
      id: queryKey[1],
    }
  );

  return post;
}) satisfies QueryFunction<unknown, [string, string]>;

const Post: FC<{
  postId: string;
  setPostId: Dispatch<React.SetStateAction<string | null | undefined>>;
}> = ({ postId, setPostId }) => {
  const { status, data, error, isFetching } = useQuery(
    ["post", postId],
    getPost,
    {
      enabled: !!postId,
    }
  );

  return (
    <div>
      <div>
        <a onClick={() => setPostId(null)} href="#">
          Back
        </a>
      </div>
      {!postId || status === "loading" ? (
        "Loading..."
      ) : status === "error" ? (
        <span>
          Error: {error instanceof Error ? error.message : `${error}`}
        </span>
      ) : (
        <>
          <h1>{data?.title}</h1>
          <div>
            <p>{data?.body}</p>
          </div>
          <div>{isFetching ? "Background Updating..." : " "}</div>
        </>
      )}
    </div>
  );
};
