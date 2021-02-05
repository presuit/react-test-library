import { render, waitFor } from "../../test-utils";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { CreateAccount } from "../create-account";
import userEvent from "@testing-library/user-event";
import { CREATE_ACCOUNT_MUTATION } from "../create-account";

describe("<CreateAccount />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });
  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Create Account | Nuber-podcasts");
    });
  });

  it("should display some error on email input", async () => {
    const { getByPlaceholderText, getByText } = renderResult;
    const emailInput = getByPlaceholderText("E-mail");

    await waitFor(() => {
      userEvent.type(emailInput, "something@");
    });
    expect(getByText("Email address invalid")).toBeDefined();

    await waitFor(() => {
      userEvent.clear(emailInput);
    });
    expect(getByText("Email is required!")).toBeDefined();
  });

  it("should display some error on password input", async () => {
    const { getByText, getByPlaceholderText, debug } = renderResult;
    const passwordInput = getByPlaceholderText("Password");
    const confirmPasswordInput = getByPlaceholderText("Confirm");

    await waitFor(() => {
      userEvent.type(passwordInput, "minLength");
    });
    expect(getByText("Password must be more than 10 characters")).toBeDefined();

    await waitFor(() => {
      userEvent.clear(passwordInput);
    });
    expect(getByText("Password is required!")).toBeDefined();

    await waitFor(() => {
      userEvent.type(passwordInput, "1234567890");
      userEvent.type(confirmPasswordInput, "12345678900");
    });
    expect(getByText("Password not matched"));
  });

  it("should submit my account data and send mutation", async () => {
    const { getByPlaceholderText, getByRole, debug, getByText } = renderResult;
    const formData = {
      email: "real@nomad.co",
      password: "shouldBeMoreThanTenString",
    };
    const emailInput = getByPlaceholderText("E-mail");
    const passwordInput = getByPlaceholderText("Password");
    const confirmPasswordInput = getByPlaceholderText("Confirm");
    const submitButton = getByRole("submit");
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "ErrorTest Its never happened normal app",
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedMutationResponse
    );
    await waitFor(() => {
      userEvent.type(emailInput, formData.email);
      userEvent.type(passwordInput, formData.password);
      userEvent.type(confirmPasswordInput, formData.password);
      userEvent.click(submitButton);
    });
    expect(mockedMutationResponse).toHaveBeenCalled();
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: "Host",
      },
    });
    expect(getByText("ErrorTest Its never happened normal app")).toBeDefined();
  });
});
