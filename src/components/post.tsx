import { QueryFunction, useQuery } from "@tanstack/react-query";
import { FC, Dispatch } from "react";
import { FragmentType, graphql, useFragment } from "../gql";
import { graphQLClient } from "../graphqlClient";

const PostFragment = graphql(/* GraphQL */ `
  fragment PostFragment on Post {
    id
    title
    body
  }
`);

type Post = FragmentType<typeof PostFragment>;

const Post: FC<{
  postId: string;
  setPostId: Dispatch<React.SetStateAction<string | null | undefined>>;
}> = ({ postId, setPostId }) => {
  const { status, data, error, isFetching } = useQuery(
    ["post", postId],
    async ({ signal, queryKey }) => {
      const { post } = await graphQLClient.request({
        document: graphql(/* GraphQL */ `
          query Post($id: ID!) {
            post(id: $id) {
              ...PostFragment
            }
          }
        `),
        signal,
        variables: { id: queryKey[1] },
      });

      console.log("post", post);

      return useFragment(PostFragment, post);
    },
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

export default Post;
