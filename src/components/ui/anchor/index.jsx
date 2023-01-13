import Link from "next/link";
import PropTypes, { object } from "prop-types";

const Anchor = ({
    path,
    children,
    className,
    rel,
    label,
    target,
    onClick,
    ...rest
}) => {
    if (!path) return null;
    console.log("typeof path: ", typeof path)
    if (typeof path !== "object") {
        const internal = /^\/(?!\/)/.test(path);
        if (!internal) {
            const isHash = path.startsWith("#");
            if (isHash) {
                return (
                    <a
                        aria-label={label}
                        className={className}
                        href={path}
                        onClick={onClick}
                        {...rest}
                    >
                        {children}
                    </a>
                );
            }
            return (
                <a
                    aria-label={label}
                    rel={rel}
                    className={className}
                    href={path}
                    target={target}
                    onClick={onClick}
                    {...rest}
                >
                    {children}
                </a>
            );
        }
    }

    return (
        <Link rel="preload" href={(typeof path === "object") ? {
            pathname: path.pathname,
            query: path.query
        } : path} passHref>
            <a
                href="passRef"
                className={className}
                aria-label={label}
                {...rest}
            >
                {children}
            </a>
        </Link>
    );
};

Anchor.defaultProps = {
    target: "_blank",
    rel: "noopener noreferrer",
};

Anchor.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    rel: PropTypes.string,
    label: PropTypes.string,
    target: PropTypes.oneOf(["_blank", "_self", "_parent", "_top"]),
    onClick: PropTypes.func,
    sx: PropTypes.objectOf(PropTypes.sx),
};

Anchor.displayName = "Anchor";

export default Anchor;
