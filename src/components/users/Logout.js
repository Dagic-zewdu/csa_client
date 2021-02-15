export const Logout = (props) => {
  localStorage.removeItem("id");
  localStorage.removeItem("token");
  localStorage.removeItem("auth");
  localStorage.removeItem("user_type");
  localStorage.removeItem("emp_id");
  console.log(props);
  props.history.push("/login");
};
