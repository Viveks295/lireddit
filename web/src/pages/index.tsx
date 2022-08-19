import {
  Box,
  Button,
  ColorModeScript,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useState } from "react";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { usePostsQuery } from "../generated/graphql";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: "" as string,
  });
  const [{ data, error, fetching }] = usePostsQuery({
    variables,
  });

  // console.log(variables);

  if (!fetching && !data) {
    return (
      <div>
        <div>something went wrong - query failed</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <>
      <Layout>
        {!data && fetching ? (
          <div>loading...</div>
        ) : (
          <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            {console.log("MODE:", theme.config.initialColorMode)}
            <Stack spacing={8}>
              {data!.posts.posts.map((p) =>
                !p ? null : (
                  <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                    <UpdootSection post={p}></UpdootSection>
                    <Box flex={1}>
                      <NextLink href="post/[id]" as={`/post/${p.id}`}>
                        <Link>
                          <Heading fontSize="xl">{p.title}</Heading>
                        </Link>
                      </NextLink>
                      <Text>posted by {p.creator.username}</Text>
                      <Flex align="center">
                        <Text mt={4}>{p.textSnippet}</Text>
                      </Flex>
                    </Box>
                    <Box>
                      <Flex
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        ml="auto"
                      >
                        <EditDeletePostButtons
                          id={p.id}
                          creatorId={p.creator.id}
                        />
                      </Flex>
                    </Box>
                  </Flex>
                )
              )}
            </Stack>
          </>
        )}
        {data && data.posts.hasMore ? (
          <Flex>
            <Button
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                });
              }}
              isLoading={fetching}
              m="auto"
              my={8}
            >
              load more
            </Button>
          </Flex>
        ) : null}
      </Layout>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
