import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue as mode,
  VisuallyHidden,
} from "@chakra-ui/react";
import * as React from "react";
import { Logo } from "./Logo";
import { LoginForm } from "./components/LoginForm";
import { FaFacebook, FaGoogle, FaGithub } from "react-icons/fa";
import { DividerWithText } from "./components/DividerWithText";

export const App = () => {
  return (
    <Box
      bg={mode("gray.50", "inherit")}
      minH="100vh"
      py="12"
      px={{ sm: "6", lg: "8" }}
    >
      <Box maxW={{ sm: "md" }} mx={{ sm: "auto" }} w={{ sm: "full" }}>
        <Box mb={{ base: "10", md: "28" }}>
          <Logo mx="auto" h="8" iconColor={mode("blue.600", "blue.200")} />
        </Box>
        <Heading mt="6" textAlign="center" size="xl" fontWeight="extrabold">
          Sign in to your account
        </Heading>
        <Text mt="4" align="center" maxW="md" fontWeight="medium">
          <span>Don&apos;t have an account?</span>
          <Box
            as="a"
            marginStart="1"
            href="#"
            color={mode("blue.600", "blue.200")}
            _hover={{ color: "blue.600" }}
            display={{ base: "block", sm: "revert" }}
          >
            Start free trial
          </Box>
        </Text>
      </Box>
      <Box maxW={{ sm: "md" }} mx={{ sm: "auto" }} mt="8" w={{ sm: "full" }}>
        <Box
          bg={mode("white", "gray.700")}
          py="8"
          px={{ base: "4", md: "10" }}
          shadow="base"
          rounded={{ sm: "lg" }}
        >
          <LoginForm />
          <DividerWithText mt="6">or continue with</DividerWithText>
          <SimpleGrid mt="6" columns={3} spacing="3">
            <Button color="currentColor" variant="outline">
              <VisuallyHidden>Login with Facebook</VisuallyHidden>
              <FaFacebook />
            </Button>
            <Button color="currentColor" variant="outline">
              <VisuallyHidden>Login with Google</VisuallyHidden>
              <FaGoogle />
            </Button>
            <Button color="currentColor" variant="outline">
              <VisuallyHidden>Login with Github</VisuallyHidden>
              <FaGithub />
            </Button>
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
};
