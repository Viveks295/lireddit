import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Tooltip,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({});
  // const { colorMode, toggleColorMode } = useColorMode();
  // const themeIcon = useColorModeValue(
  //   <Tooltip label={"dark"}>
  //     <MoonIcon />
  //   </Tooltip>,
  //   <Tooltip label={"light"}>
  //     <SunIcon />
  //   </Tooltip>
  // );
  let body = <></>;

  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <>
        <Flex align="center">
          <NextLink href="/create-post">
            <IconButton
              as={Link}
              mr={2}
              aria-label="create post"
              icon={
                <Tooltip label="create post">
                  <AddIcon />
                </Tooltip>
              }
            />
          </NextLink>
          {/* <IconButton
            mr={2}
            aria-label="toggle light/dark mode"
            icon={themeIcon}
            onClick={toggleColorMode}
          /> */}
          {/* {console.log("color: ", colorMode)} */}
          <Box mr={2}>{"Hello, " + data.me.username}</Box>
          <Button
            onClick={async () => {
              await logout();
              router.reload();
            }}
            isLoading={logoutFetching}
            variant="link"
          >
            logout
          </Button>
        </Flex>
      </>
    );
  }
  return (
    <Flex
      zIndex={1}
      position="sticky"
      top={0}
      bg="teal.500"
      p={4}
      align="center"
    >
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
