import { useQuery } from "@tanstack/react-query";
import { Dispatch, FC } from "react";
import { sdk } from "../graphqlClient";

const Post: FC<{
  postId: string;
  setPostId: Dispatch<React.SetStateAction<string | null | undefined>>;
}> = ({ postId, setPostId }) => {
  const { status, data, error, isFetching } = useQuery(
    ["post", postId],
    async ({ signal, queryKey }) => {
      const { post } = await sdk.GetPost({ id: queryKey[1] }, signal);
      return post;
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
