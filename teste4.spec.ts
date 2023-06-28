import { MsalService } from "@azure/msal-angular";
import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let msalServiceMock: jest.Mocked<MsalService>;

  beforeEach(() => {
    msalServiceMock = {
      instance: {
        getAllAccounts: jest.fn().mockReturnValue([{ idTokenClaims: { name: "John Doe", preferred_username: "john@example.com" } }])
      }
    } as unknown as jest.Mocked<MsalService>;

    component = new HeaderComponent(msalServiceMock);
  });

  it("should initialize name and email properties with user data", () => {
    component.ngOnInit();

    expect(component.name).toBe("John Doe");
    expect(component.email).toBe("john@example.com");
  });
});
