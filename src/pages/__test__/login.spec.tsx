import { render, waitFor } from "../../test-utils";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { getByText, RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { Login } from "../login";
import userEvent from "@testing-library/user-event";
import { LOGIN_MUTATION } from "../login";
import { debug } from "console";

describe("<Login />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(async () => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      );
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve("");
        }, 0);
      });
    });
  });
  it("renders OK", async () => {
    expect(document.title).toBe("Log In | Nuber-podcasts");
  });

  it("should display some errors on email", async () => {
    const { getByPlaceholderText, getByText } = renderResult;
    const emailInput = getByPlaceholderText("E-mail");
    await waitFor(() => {
      userEvent.type(emailInput, "bullshiit@");
      userEvent.clear(emailInput);
    });
    expect(getByText("Email is required!")).toBeDefined();
  });

  it("should display some errors on password", async () => {
    const { getByPlaceholderText, getByText } = renderResult;
    const passwordInput = getByPlaceholderText("Password");
    await waitFor(() => {
      userEvent.type(passwordInput, "short");
    });
    expect(getByText("Password must be more than 10 characters")).toBeDefined();

    await waitFor(() => {
      userEvent.clear(passwordInput);
    });
    expect(getByText("Password is required!")).toBeDefined();
  });

  it("should login successfully", async () => {
    const formData = {
      email: "real@nomad.co",
      password: "1234567890",
    };
    const { getByPlaceholderText, getByRole, getByText } = renderResult;
    const emailInput = getByPlaceholderText("E-mail");
    const passwordInput = getByPlaceholderText("Password");
    const submitButton = getByRole("submit");
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          error: "ErrorTesting",
          token: "TEST_TOKEN",
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

    await waitFor(() => {
      userEvent.type(emailInput, formData.email);
      userEvent.type(passwordInput, formData.password);
      userEvent.click(submitButton);
    });

    expect(mockedMutationResponse).toHaveBeenCalled();
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        ...formData,
      },
    });
    expect(getByText("ErrorTesting")).toBeDefined();
  });
});
