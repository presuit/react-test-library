import { render } from "../../test-utils";
import { FormError } from "../form-error";

describe("<FormError />", () => {
  it("should render with OK with errorMsg", () => {
    const { getByText } = render(<FormError errorMessage={"Testing"} />);
    getByText("Testing");
  });
});
