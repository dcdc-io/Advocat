export async function get(req, res, next) {
    res.clearCookie("AuthSession")
    res.redirect("/login")
}