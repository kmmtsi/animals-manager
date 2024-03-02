import userEvent from "@testing-library/user-event";
// https://testing-library.com/docs/user-event/intro#differences-from-fireevent
import { UserEvent } from "@testing-library/user-event";

export const click = async (element: HTMLElement, existingUser?: UserEvent) => {
  const user = existingUser || userEvent.setup();
  await user.click(element);
  return { user };
};

export const pressKey = async (
  key: string,
  element: HTMLElement,
  existingUser?: UserEvent
) => {
    // Enter: [Enter]
  const user = existingUser || userEvent.setup();
  element.focus();
  await user.keyboard(key);
  return { user };
};
