import { useEffect, useState } from "react";
import { Navbar, Tooltip, UnstyledButton, createStyles, Stack } from "@mantine/core";
import { IconLogout, IconList, IconUser } from "@tabler/icons";
import Link from "next/link";
import useUser from "../hooks/useUser";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
	link: {
		width: 50,
		height: 50,
		borderRadius: theme.radius.md,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],

		"&:hover": {
			backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
		},
	},

	active: {
		"&, &:hover": {
			backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
			color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
		},
	},
}));

function NavbarLink({ icon: Icon, label, active, onClick }) {
	const { classes, cx } = useStyles();
	return (
		<Tooltip label={label} position="right" transitionDuration={0}>
			<UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
				<Icon stroke={1.5} />
			</UnstyledButton>
		</Tooltip>
	);
}

const linkData = [
	{
		icon: IconList,
		label: "Endpoints",
		href: "/",
		active: ["/", "/endpoints/[endpoint]", "/endpoints/new", "/addimage"],
	},
	{ icon: IconUser, label: "Users", href: "/users", active: ["/users", "/users/new"] },
];

export default function Nav() {
	const { handlers } = useUser();
	const router = useRouter();

	console.log(router.pathname);
	const links = linkData.map((link) => (
		<Link href={link.href} key={link.label}>
			<NavbarLink {...link} active={link.active.includes(router.pathname)} />
		</Link>
	));

	return (
		<Navbar width={{ base: 80 }} p="md">
			<Navbar.Section grow>
				<Stack justify="center" spacing={5}>
					{links}
				</Stack>
			</Navbar.Section>
			<Navbar.Section>
				<Stack justify="center" spacing={0}>
					<NavbarLink icon={IconLogout} label="Logout" onClick={handlers.logout} />
				</Stack>
			</Navbar.Section>
		</Navbar>
	);
}
