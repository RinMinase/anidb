import SweetAlert from "sweetalert2";
import Cookies from "js-cookie";

const Swal = SweetAlert.mixin({
  willOpen: () => {
    const preferDark = window?.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const savedMode = Cookies.get("color-mode") as "light" | "dark" | undefined;
    const defaultMode = savedMode ?? (preferDark ? "dark" : "light");

    const container = document.getElementsByClassName("swal2-container");
    const popup = document.getElementsByClassName("swal2-popup");
    const iconParts = document.querySelectorAll(
      `.swal2-success-circular-line-left,
      .swal2-success-circular-line-right,
      .swal2-success-fix`,
    );

    if (container.length) {
      (container[0] as any).style.zIndex = 99999;
    }

    if (popup.length) {
      if (defaultMode === "light") {
        (popup[0] as any).style.backgroundColor = "#fff";
        (popup[0] as any).style.color = "#545454";
      } else {
        (popup[0] as any).style.backgroundColor = "#272727";
        (popup[0] as any).style.color = "#fff";
      }
    }

    if (iconParts.length) {
      if (defaultMode === "light") {
        iconParts.forEach((part) => {
          (part as any).style.backgroundColor = "#fff";
        });
      } else {
        iconParts.forEach((part) => {
          (part as any).style.backgroundColor = "#272727";
        });
      }
    }
  },
  showClass: {
    popup: "animate__animated animate__headShake",
  },
  allowOutsideClick: false,
});

export default Swal;
