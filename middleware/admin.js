export default function({ store, redirect }) {
    // If the user is not authenticated
    let rol = store.state.authUser.user.rol_id.rol;
    if (!store.state.authenticated && (rol != 'root' && rol != 'admin')) {
        return redirect('/')
    }
}