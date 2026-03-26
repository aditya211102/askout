import { matchPath, useLocation } from "react-router-dom";
import Seo from "@/components/Seo";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME } from "@/lib/site";

const RouteSeo = () => {
  const { pathname } = useLocation();

  if (pathname === "/") {
    return null;
  }

  if (pathname === "/askout/create" || pathname === "/create") {
    return (
      <Seo
        title={`Create an Ask-Out Card | ${SITE_NAME}`}
        description="Design a playful ask-out card, personalize the message, and send it as a shareable link in seconds."
        keywords="ask out card, proposal card online, digital card for couples, send a gift as a link"
        path={pathname}
      />
    );
  }

  if (pathname === "/bouquet/create") {
    return (
      <Seo
        title={`Create a Digital Bouquet | ${SITE_NAME}`}
        description="Build a personalized digital bouquet online and share it instantly as a romantic surprise, anniversary gift, or long-distance gesture."
        keywords="digital bouquet, anniversary gift online, bouquet online India, personalized gift for couples"
        path={pathname}
      />
    );
  }

  if (pathname === "/voice/create") {
    return (
      <Seo
        title={`Create a Voice Note Gift | ${SITE_NAME}`}
        description="Record a heartfelt voice note gift, wrap it in a beautiful reveal, and send it as a private link."
        keywords="voice note gift, audio love message, digital gift India, long distance relationship gift"
        path={pathname}
      />
    );
  }

  if (pathname === "/auth") {
    return <Seo title={`Sign In | ${SITE_NAME}`} description={SITE_DESCRIPTION} keywords={SITE_KEYWORDS} path={pathname} robots="noindex,nofollow" />;
  }

  if (pathname === "/profile" || pathname === "/checkout" || pathname === "/success") {
    return <Seo title={`${SITE_NAME}`} description={SITE_DESCRIPTION} keywords={SITE_KEYWORDS} path={pathname} robots="noindex,nofollow" />;
  }

  if (
    matchPath("/card/:id", pathname) ||
    matchPath("/bouquet/:id", pathname) ||
    matchPath("/voice/:id", pathname)
  ) {
    return (
      <Seo
        title={`Open Your Gift | ${SITE_NAME}`}
        description="A private digital gift is waiting for you."
        keywords={SITE_KEYWORDS}
        path={pathname}
        robots="noindex,nofollow"
      />
    );
  }

  return <Seo title={`Page Not Found | ${SITE_NAME}`} description={SITE_DESCRIPTION} keywords={SITE_KEYWORDS} path={pathname} robots="noindex,nofollow" />;
};

export default RouteSeo;
