import { MemoryRouter, Route, Routes } from "react-router-dom"

import { RootLayout } from "./layouts/root-layout"
import { HomePage } from "./pages/home"
import { SignInPage } from "./pages/sign-in"
import { SignUpPage } from "./pages/sign-up"

import "~style.css"

function IndexPopup() {
  return (
    <MemoryRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

export default IndexPopup
