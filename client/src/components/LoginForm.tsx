import {
  Button,
  FormControl,
  Icon,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import * as React from "react";
import { FaSpotify } from "react-icons/fa";
import { PasswordField } from "./PasswordField";

export const LoginForm = () => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // your login logic here
      }}
    >
      <Stack spacing="6">
        <Button type="submit" colorScheme="green" size="lg" fontSize="md">
          <Icon as={FaSpotify} /> &nbsp; Log in with Spotify
        </Button>
      </Stack>
    </form>
  );
};
