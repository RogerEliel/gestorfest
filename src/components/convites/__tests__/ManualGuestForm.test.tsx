
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import ManualGuestForm from "../ManualGuestForm";

describe("ManualGuestForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockReset();
    mockOnCancel.mockReset();
  });

  it("renders the form correctly", () => {
    render(
      <ManualGuestForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
      />
    );

    expect(screen.getByLabelText(/nome do convidado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/observação/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /salvar convidado/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(
      <ManualGuestForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /salvar convidado/i }));

    await waitFor(() => {
      expect(screen.getByText(/o nome deve ter pelo menos 3 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/o telefone deve ter pelo menos 8 dígitos/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("validates phone number format", async () => {
    render(
      <ManualGuestForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
      />
    );

    await userEvent.type(screen.getByLabelText(/nome do convidado/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/telefone/i), "123"); // Invalid phone

    fireEvent.click(screen.getByRole("button", { name: /salvar convidado/i }));

    await waitFor(() => {
      expect(screen.getByText(/o telefone deve ter pelo menos 8 dígitos/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("submits the form with valid data", async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);

    render(
      <ManualGuestForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
      />
    );

    await userEvent.type(screen.getByLabelText(/nome do convidado/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/telefone/i), "+5511999999999");
    await userEvent.type(screen.getByLabelText(/observação/i), "VIP Guest");

    fireEvent.click(screen.getByRole("button", { name: /salvar convidado/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        nome_convidado: "John Doe",
        telefone: "+5511999999999",
        mensagem_personalizada: "VIP Guest"
      });
    });
  });

  it("shows loading state when submitting", () => {
    render(
      <ManualGuestForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={true}
      />
    );

    expect(screen.getByRole("button", { name: /salvando/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /salvando/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeDisabled();
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(
      <ManualGuestForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
