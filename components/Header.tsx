// Header.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();
  let activePath = status === "authenticated" ? "/list" : "/" 
  let left = (
    <div className="left">
      <Link legacyBehavior href={activePath}>
        <a className="bold" data-active={isActive(activePath)}>
          listacea
        </a>
      </Link>
      <style jsx>{`
        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: var(--geist-foreground);
          display: inline-block;
        }

        .left a[data-active='true'] {
          color: gray;
        }

        a + a {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );

  let right = null;

  if (status === 'loading') {
    left = (
      <div className="left">
        <Link legacyBehavior href={activePath}>
          <a className="bold" data-active={isActive(activePath)}>
            listacean
          </a>
        </Link>
        <style jsx>{`
          .bold {
            font-weight: bold;
          }

          a {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
          }

          .left a[data-active='true'] {
            color: gray;
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <p>Validating session ...</p>
        <style jsx>{`
          .right {
            margin-left: auto;
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="right">
        <Link legacyBehavior href="/api/auth/signin">
          <a data-active={isActive('/signup')}>Login</a>
        </Link>
        <style jsx>{`
          a {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
          }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }

          .right a {
            font-size: 16px;
            padding: 0.7rem 1.4rem;
            border-radius: 3px;
            background-color: var(--secondary-button-bg);
          }

          .right a:hover {
            transform: translate(0, -3px);
          }
        `}</style>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="left">
        <Link legacyBehavior href={activePath}>
          <a className="bold" data-active={isActive(activePath)}>
            listacean
          </a>
        </Link>
        <style jsx>{`
          .bold {
            font-weight: bold;
          }

          a {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
          }

          .left a[data-active='true'] {
            color: gray;
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <Link legacyBehavior href="/recipes">
          <a className="recipe-button" data-active={isActive("/recipes")}>
            Recipes
        </a>
        </Link>
        <span>{session.user.email}</span>
        <button className='button' onClick={() => signOut()}>
          <a>Log out</a>
        </button>
        <style jsx>{`
          a {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
            font-size: 14px;
          }

          .recipes-button {
            padding: 1px;
          }

          span {
            display: inline-block;
            font-size: 13px;
            padding-right: 1rem;
          }

            @media only screen and (max-width: 800px) {
              span {
                display: none;
              }
            }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }

          .right .recipe-button {
            background-color: var(--secondary-button-bg);
            color: var(--color);
            padding: 11px 14px 11px 14px;
            border-radius: 3px;
          }

          .right .recipe-button:hover {
            transform: translate(0, -3px);
          }

          .recipe-button {
            margin-right: 1rem;
          }

          .button {
            font-family: inherit;
            border: none;
            color: #000;
            background-color: transparent;
          }

          .button 
        `}</style>
      </div>
    );
  }

  return (
    <nav>
      {left}
      {right}
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }
      `}</style>
    </nav>
  );
};

export default Header;