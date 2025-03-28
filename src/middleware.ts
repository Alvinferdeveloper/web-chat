import withAuth from 'next-auth/middleware'
export { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
})
 
export const config = {
  matcher: [
    '/',
    '/plans'
  ],
}