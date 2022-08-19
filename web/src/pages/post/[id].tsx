import { Box, Flex, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { UpdootSection } from "../../components/UpdootSection";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";

const Post = ({}) => {
  const [{ data, error, fetching }] = useGetPostFromUrl();
  const dateToTime = (date) =>
    date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  const localCreatedDate = new Date(data.post.createdAt);
  const localUpdatedDate = new Date(data.post.updatedAt);
  const cDateStr = localCreatedDate.toString();
  const uDateStr = localUpdatedDate.toString();

  return (
    <Layout>
      <Flex>
        <UpdootSection post={data.post}></UpdootSection>
        <Flex direction="column">
          <Heading mt={2}>{data.post.title}</Heading>
          <Box mt={2}>posted by {data.post.creator.username}</Box>
        </Flex>
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          ml="auto"
        >
          <EditDeletePostButtons
            id={data.post.id}
            creatorId={data.post.creator.id}
          />
        </Flex>
      </Flex>
      <Box mt={10}>{data.post.text}</Box>
      <Box mt={10}>
        post created: {cDateStr.slice(3, 15)}, {dateToTime(localCreatedDate)}
      </Box>
      {data.post.updatedAt === data.post.createdAt ? (
        <Box>last updated: never</Box>
      ) : (
        <Box>
          last updated: {uDateStr.slice(3, 15)}, {dateToTime(localUpdatedDate)}
        </Box>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
