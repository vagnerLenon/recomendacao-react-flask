import React, { createContext, useCallback, useState } from 'react';

interface IAuthContextManagerProps {
  children: React.ReactNode;
}

interface IUserInfo {
  nome: string;
  nascimento: string | null;
  cidade: string | null;
  livros: string[] | null;
}

interface IEditInfo extends Omit<IUserInfo, 'nome'> {}

const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthContextProps {
  haveUser: boolean;
  login: (nome: string) => void;
  updateData: (props: IEditInfo) => void;
  logOut: () => void;
  user: IUserInfo | null;
}

const STORAGENAME = '@deusMeLivro';

const AuthContextManager: React.FC<IAuthContextManagerProps> = ({
  children,
}) => {
  const [user, setUser] = useState<IUserInfo | null>(() => {
    const localUser = localStorage.getItem(`${STORAGENAME}.user`);
    if (localUser != null) {
      return JSON.parse(localUser);
    } else {
      localStorage.removeItem(`${STORAGENAME}.user`);
      return null;
    }
  });

  const isSignedIn = useCallback(() => {
    return user != null;
  }, [user]);

  const logOut = useCallback(() => {
    localStorage.removeItem(`${STORAGENAME}.user`);
    setUser(null);
  }, []);

  const login = useCallback((nome: string) => {
    setUser({ nome, cidade: null, livros: null, nascimento: null });
    localStorage.setItem(
      `${STORAGENAME}.user`,
      JSON.stringify({ nome, cidade: null, livros: null, nascimento: null })
    );
  }, []);

  const updateData = useCallback(
    ({ cidade, livros, nascimento }: IEditInfo) => {
      console.log('aaa');
      const newUser: IUserInfo = { ...user } as IUserInfo;
      Object.assign(newUser, { cidade: cidade ? cidade : null });
      Object.assign(newUser, { livros: livros ? livros : null });
      Object.assign(newUser, { nascimento: nascimento ? nascimento : null });

      setUser(newUser);
      localStorage.setItem(`${STORAGENAME}.user`, JSON.stringify(newUser));
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        haveUser: isSignedIn(),
        login,
        logOut,
        updateData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextManager };
