import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { IconButton, Link, Tooltip } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [, deletePost] = useDeletePostMutation();
  const [{ data: meData }] = useMeQuery();

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <>
      <Tooltip label="delete post">
        <IconButton
          aria-label="delete post"
          icon={<DeleteIcon />}
          onClick={() => {
            deletePost({ id });
          }}
          variant="ghost"
        />
      </Tooltip>

      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          aria-label="edit post"
          icon={
            <Tooltip label="edit post">
              <EditIcon />
            </Tooltip>
          }
          variant="ghost"
        />
      </NextLink>
    </>
  );
};
