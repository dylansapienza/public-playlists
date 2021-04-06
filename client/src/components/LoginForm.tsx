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

export const LoginForm = () => {
  function spotifylogin() {
    window.location.replace("http://localhost:5000/api/login");
  }

  return (
    <Stack spacing="6">
      <Button
        onClick={() => {
          spotifylogin();
        }}
        type="submit"
        colorScheme="green"
        size="lg"
        fontSize="md"
      >
        <Icon as={FaSpotify} /> &nbsp; Log in with Spotify
      </Button>
    </Stack>
  );
};
