import React from "react";
import PropTypes from "prop-types";

import { animated, config } from "react-spring/renderprops";

import "./text-transition.styl";

const newText = (text) => ({ key: `${Date.now()}`, data: text });

const TextTransition = ({
	text,
	direction,
	inline,
	delay,
	className,
	style,
	noOverflow,
	springConfig,
	useEffect,
	useSpring,
	useTransition,
	config,
}) => {
	const placeholderRef = React.useRef(null);
	const [content, setContent] = React.useState(() => newText(""));
	const [timeoutId, setTimeoutId] = React.useState(0);
	const [containerStyles, setWidth] = useSpring(() => ({
		to: { width: inline ? 0 : "auto" },
		config: springConfig,
	}));
	const transitions = useTransition(content, (item) => item.key, {
		from: {
			opacity: 0,
			transform: `translateY(${direction === "down" ? "-100%" : "100%"})`,
		},
		enter: { opacity: 1, transform: "translateY(0%)" },
		leave: {
			opacity: 0,
			transform: `translateY(${direction === "down" ? "100%" : "-100%"})`,
		},
		config: springConfig,
	});
	useEffect(() => {
		setTimeoutId(
			setTimeout(() => {
				if (!placeholderRef.current) return;
				placeholderRef.current.innerHTML = text;
				if (inline) setWidth({ width: placeholderRef.current.offsetWidth });
				setContent(newText(text));
			}, delay)
		);
	}, [text]);

	useEffect(() => () => clearTimeout(timeoutId), []);

	return (
		<animated.div
			style={{
				...containerStyles,
				whiteSpace: inline ? "nowrap" : "normal",
				display: inline ? "inline-block" : "block",
				...style,
			}}
			className={`text-transition ${className}`}
		>
			<span ref={placeholderRef} className="text-transition_placeholder" />
			<div
				className="text-transition_inner"
				style={noOverflow ? { overflow: "hidden" } : {}}
			>
				{transitions.map(({ item, props, key }) => (
					<animated.div key={key} style={props}>
						{item.data}
					</animated.div>
				))}
			</div>
		</animated.div>
	);
};

TextTransition.propTypes = {
	text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	direction: PropTypes.oneOf(["up", "down"]),
	inline: PropTypes.bool,
	noOverflow: PropTypes.bool,
	delay: PropTypes.number,
	className: PropTypes.string,
	style: PropTypes.object,
	springConfig: PropTypes.any,
};

TextTransition.defaultProps = {
	direction: "up",
	noOverflow: false,
	inline: false,
	springConfig: config.default,
	delay: 0,
	className: "",
	style: {},
};

export default TextTransition;
