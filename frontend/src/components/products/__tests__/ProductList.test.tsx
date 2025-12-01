// import "@testing-library/jest-dom";
// import { render, screen, waitFor } from "@testing-library/react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ProductList } from "../ProductList";

// import { vi } from "vitest";
// vi.mock("../../../api/product.api");
// import { productApi } from "../../../api/product.api";

// const queryClient = new QueryClient({
//   defaultOptions: { queries: { retry: false } },
// });

// const wrapper = ({ children }: { children: React.ReactNode }) => (
//   <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
// );

// describe("ProductList", () => {
//   it("should render products table", async () => {
//     const mockProducts = {
//       data: [
//         { _id: "1", name: "Product 1", price: 100, sku: "SKU-001" },
//         { _id: "2", name: "Product 2", price: 200, sku: "SKU-002" },
//       ],
//       pagination: { total: 2, page: 1, limit: 10 },
//     };

//     (productApi.getAll as jest.Mock).mockResolvedValue(mockProducts);

//     render(<ProductList />, { wrapper });

//     await waitFor(() => {
//       expect(screen.getByText("Product 1")).toBeInTheDocument();
//       expect(screen.getByText("Product 2")).toBeInTheDocument();
//     });
//   });
// });
