import { useMediaQuery, useTheme } from "@mui/material";

const Page404 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div>
      <img
        src="/404.jpg"
        style={{
          height: isTablet ? "calc(100vh - 48px - 4px)" : "calc(100vh - 48px)",
          width: "100vw",
          objectFit: "cover",
          objectPosition: isMobile ? "65%" : isTablet ? "60%" : undefined,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
      />
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: isMobile ? "35px" : isTablet ? "183px" : "35px",
            left: isMobile ? 0 : isTablet ? "30px" : "100px",
            textAlign: "center",
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "center",
            flexDirection: "column",
            width: isMobile ? "180px" : undefined,
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? 115 : isTablet ? 140 : 105,
              margin: 0,
              lineHeight: isMobile ? "130px" : "120px",
              color: "white",
              position: "relative",
            }}
          >
            <span
              style={{
                webkitTextStroke: "3px #37474F",
                paintOrder: "stroke fill",
              }}
            >
              404
            </span>
            <span
              style={{
                position: "absolute",
                webkitTextStroke: 0,
                top: 0,
                left: 0,
              }}
            >
              404
            </span>
          </h1>
          <h2
            style={{
              fontSize: isMobile ? undefined : isTablet ? 36 : undefined,
              lineHeight: isTablet ? "38px" : undefined,
              marginTop: 0,
              color: "white",
              position: "relative",
            }}
          >
            <span
              style={{
                webkitTextStroke: "2px #37474F",
                paintOrder: "stroke fill",
              }}
            >
              🚧 We are at a crossroads 🚧
            </span>
            <span
              style={{
                position: "absolute",
                webkitTextStroke: 0,
                top: 0,
                left: 0,
              }}
            >
              🚧 We are at a crossroads 🚧
            </span>
          </h2>
          <a
            href="/"
            style={{
              fontSize: 21,
              color: "#37474F",
              textDecoration: "none",
              border: "1px solid #F4511E",
              backgroundColor: "#FF8A65",
              padding: "8px 24px",
              borderRadius: 8,
            }}
          >
            Return from nothingness
          </a>
        </div>
      </div>
    </div>
  );
};

export default Page404;
