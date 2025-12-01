import { isBefore, isSameDay } from "date-fns";
import { SERVER_API_URL } from "../config/config";
export interface Booking {
  startDate: string;
  endDate: string;
  apartment: "A" | "B" | "C";
}

export type Rating = 1 | 2 | 3 | 4 | 5;
export interface ReviewProps {
  name: string;
  rating: Rating;
  review: string;
  apartment: "A" | "B" | "C";
}

export const clearDatabase = async () => {
  try {
    const response = await fetch(`${SERVER_API_URL}/clear`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    window.alert("Database cleared");
    return true;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    window.alert("Database could not be cleared");
    return false;
  }
};

export const ClearDatabaseButton = () => {
  return (
    <button
      onClick={() => {
        clearDatabase();
      }}
      style={{
        background: "transparent",
        border: "solid 1px red",
        color: "white",
        padding: "5px",
        borderRadius: "5px",
        position: "absolute",
        top: "calc(var(--nav-height) + 5px)",
        left: "10px",
        zIndex: 5,
      }}
    >
      Clear Database
    </button>
  );
};

export const getUsernameForEmail = async (
  email: string
): Promise<string | undefined> => {
  try {
    const formData = new FormData();
    formData.append("email", email);
    const response = await fetch(`${SERVER_API_URL}/username`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return (await response.json()).username;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return undefined;
  }
};

export const fetchOccupiedDates = async (selectedApartment: string) => {
  try {
    const response = await fetch(
      `${SERVER_API_URL}/reservations/${selectedApartment}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const x: Date[] = [];
    data.forEach(
      ({ start_date, end_date }: { start_date: string; end_date: string }) => {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        for (
          let d = new Date(startDate);
          isBefore(d, endDate) || isSameDay(d, endDate);
          d.setDate(d.getDate() + 1)
        ) {
          x.push(new Date(d));
        }
      }
    );
    return x;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
};

export const fetchActiveBookings = async (
  email: string | null | undefined
): Promise<Booking[]> => {
  if (email === null || email === "" || email === undefined) {
    console.error("Email not found");
    return [];
  }
  try {
    const formData = new FormData();
    formData.append("email", email);
    const response = await fetch(`${SERVER_API_URL}/active`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      console.log(
        `${data?.length || 0} active bookings retreived successfully.`
      );
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching active bookings:", error);
    return [];
  }
};

export const fetchInactiveBookings = async (
  email: string | null | undefined
): Promise<Booking[]> => {
  if (email === null || email === "" || email === undefined) {
    console.error("Email not found");
    return [];
  }
  try {
    const formData = new FormData();
    formData.append("email", email);
    const response = await fetch(`${SERVER_API_URL}/inactive`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      `${data?.length || 0} inactive bookings retreived successfully.`;
      return data.bookings;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching inactive bookings:", error);
    return [];
  }
};

export const fetchRatings = async ({
  selectedApartment,
}: {
  selectedApartment: "A" | "B" | "C" | "all";
}): Promise<ReviewProps[]> => {
  try {
    const response = await fetch(
      `${SERVER_API_URL}/reviews${selectedApartment == "all" ? "" : "/" + selectedApartment}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
};

export const fetchCurrentRating = async (
  email: string,
  selectedApartment: "A" | "B" | "C"
): Promise<ReviewProps | undefined> => {
  try {
    if (email === "") {
      return undefined;
    }
    const formData = new FormData();
    formData.append("email", email);
    formData.append("apartment", selectedApartment);
    const response = await fetch(`${SERVER_API_URL}/user-review`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return undefined;
  }
};

export const submitReview = (
  email: string,
  review: string,
  rating: Rating,
  apartment: "A" | "B" | "C"
) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("review", review.trim());
  formData.append("rating", JSON.stringify(rating));
  formData.append("apartment", apartment);
  fetch(`${SERVER_API_URL}/review`, {
    method: "POST",
    body: formData,
  });
};

// TODO: Improve security by using a more secure method for password reset
export const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string
) => {
  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword); // instant overwriting of password
    const response = await fetch(`${SERVER_API_URL}/reset-password`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return true;
  } catch (error) {
    console.error("Fetch to change password failed::", error);
    return false;
  }
};

export const sendMail = async (
  recipient: string,
  subject: string,
  body: string
) => {
  try {
    const formData = new FormData();
    formData.append("target_mail", recipient);
    formData.append("subject", subject);
    formData.append("body", body);
    const response = await fetch(`${SERVER_API_URL}/mail`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return true;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return false;
  }
};

export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${SERVER_API_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return true;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return false;
  }
};
