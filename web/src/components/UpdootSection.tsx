import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          // implement unvote
          // if (post.voteStatus === 1) {
          //   return;
          // }
          setLoadingState("updoot-loading");
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "updoot-loading"}
        aria-label="updoot"
        icon={
          <TriangleUpIcon
            color={post.voteStatus === 1 ? "red.500" : undefined}
          />
        }
        variant="ghost"
      />
      <Text
        color={
          post.voteStatus === 1
            ? "red.500"
            : post.voteStatus === -1
            ? "blue.500"
            : undefined
        }
      >
        {post.points}
      </Text>
      {/* {post.points} */}
      <IconButton
        onClick={async () => {
          setLoadingState("downdoot-loading");
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downdoot-loading"}
        aria-label="downdoot"
        icon={
          <TriangleDownIcon
            color={post.voteStatus === -1 ? "blue.500" : undefined}
          />
        }
        variant="ghost"
      />
    </Flex>
  );
};
