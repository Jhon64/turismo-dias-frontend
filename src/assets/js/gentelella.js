
// activar user-profile dorpdown a traves del evento click
let navbarMenu = document.querySelectorAll(".nav-header-option");
//let menuProfileDropdown = document.querySelector(".dropdown-usermenu");

navbarMenu.forEach((navItem) => {
    navItem.addEventListener("click", function (e) {
        if (this.children[1].classList.contains("active")) {
            this.children[1].classList.remove("active");
        } else {
            navbarMenu.forEach((navItem) => {
                navItem.children[1].classList.remove("active");
            });
            this.children[1].classList.add("active");
        }

        //this.classList.add("active")
    });
});

/*let sidebarOptions = document.querySelectorAll(".side-menu>li");
sidebarOptions.forEach((sidebarItem) => {
  console.log(sidebarItem)
  sidebarItem.addEventListener("click", function (e) {
    if (this.classList.contains("active")) {
      this.classList.remove("active");
    } else {
      sidebarOptions.forEach((item) => {
        item.classList.remove("active");
      });
      this.classList.add("active");
    }
  });
});
*/
let menu_toggle = document.querySelector("#toggle-menu");

/*  if (menu_toggle !== null) {
    menu_toggle.addEventListener("click", function () {
      let sidebar = document.querySelector("#container-body");
      if (sidebar.classList.contains("active-sidebar-menu")) {
        sidebar.classList.remove("active-sidebar-menu");
        sidebar.classList.add("container-body");
      } else {
        sidebar.classList.add("active-sidebar-menu");
        sidebar.classList.remove("container-body");
      }
    });
  }
;*/
