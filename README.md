# Site HBO Max — Clone com modificações

![HBO Max Cover](assets/images/readme-images/cover.png)

O projeto é um clone do site [HBO Max](https://www.hbomax.com/br/pt), com o intuito de reproduzir a interface, com algumas modificações, aplicando os temas abordados ao longo das aulas de CSS da plataforma da [Digital Innovation One](https://dio.me).

O clone do site HBO Max serve como desafio para os alunos da plataforma testarem seus conhecimentos e colocarem em prática os recursos de HTML e CSS abordados nos cursos.

[![HBO Max Preview](assets/images/readme-images/cover-2.png)](https://micheleambrosio.github.io/hbomax/)

## 📎 Sumário

- [✨ Features](#-features)
- [📦 Temas abordados](#-temas-abordados)
- [🏆 Desafio](#-desafio)
- [🌈 Demonstração](#-demonstração)
- [💻 Autora](#-autora)

## ✨ Features

- Menu de navegação
- Cabeçalho com animação gradiente
- Cards com os planos de assinatura animados
- Lista de filmes e séries disponíveis na plataforma
- Formulário de login
- Rodapé com links importantes
- UI Responsiva

*As features são visuais, não possuindo integração com nenhuma API. O intuito do projeto é reproduzir a interface do site original, com algumas modificações.*

## 📦 Temas abordados

O projeto possui como intuito aplicar os conceitos abordados na Trilha de CSS da [DIO](https://dio.me), ministrada pela instrutora [Michele Ambrosio](https://github.com/micheleambrosio).

Recursos CSS presentes no projeto:

- Fundamentos do CSS
- Grid Layout
- Flexbox
- Responsividade
- Pseudo-elementos
- Pseudo-classes
- Transformações 2D e 3D
- Transições e animações
- Tratamento de campos inválidos no formulário
- Seletor parental `:has()` para efeitos hover entre irmãos
- Animação gradiente com `background-size` e `@keyframes`
- Scroll snap para carrossel horizontal em mobile
- Scrollbar customizada (WebKit + Firefox)
- Foco visível (`:focus-visible`) para navegação por teclado

## 🏆 Desafio

Como parte do desafio final da Trilha de CSS, o desenvolvedor deve reproduzir [esse projeto](https://micheleambrosio.github.io/hbomax/), sem realizar uma consulta do código final do site, presente na branch `master` deste repositório.

Para auxiliar na reprodução, utilize a branch `template-desafio`. Faça um fork do projeto em sua conta do GitHub.

Dentro da branch `template-desafio`, você encontrará na pasta `assets/images` todos os arquivos de imagens que você irá precisar para utilizar no projeto.

Caso deseje, adicione as variáveis CSS abaixo, que contém todas as cores e gradientes utilizados no projeto:

```css
  :root {
    --primary-color: #020228;
    --secondary-color: #ff00e5;
    --tertiary-color: #b535f6;
    --btn-bg-color-gradient: linear-gradient(
      45deg,
      #9b34ef 0%,
      #490cb0 20%,
      transparent 50%
    );
    --btn-link-bg-color: #fff;
    --btn-link-color: #000;
    --card-bg-color: linear-gradient(0deg, transparent, #3b1e63);
    --divider-bg-color: linear-gradient(
      90deg,
      #5516ba,
      rgba(255, 0, 229, 0.5) 80%
    );
    --nav-bg-color: rgba(0, 0, 0, 0.3);
    --text-color: #fff;
    --link-color: #9e86ff;
    --form-bg-color: rgba(211, 211, 211, 0.06);
    --form-field-bg-color: rgba(0, 0, 0, 0.2);
    --form-field-border: 1px solid rgba(255, 255, 255, 0.7);
    --form-field-placeholder: rgba(255, 255, 255, 0.7);
    --form-field-error: rgb(255, 76, 76);
  }
```

*A propriedade `scroll-behavior: smooth` irá fazer com que os links que levam para uma outra sessão do site, da mesma página, faça uma transição suave ao realizar a rolagem.*

Para implementar a barra de rolagem personalizada, como no exemplo, adicione na sua folha de estilos o seguinte trecho CSS:

```css
  /* Custom Scroll */

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--tertiary-color);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-color);
  }
```

O resultado final do projeto deve contemplar todas as [features](#-features) presentes no [resultado final](https://micheleambrosio.github.io/hbomax/).

As fontes utilizadas no projeto foram:

- [Raleway](https://fonts.google.com/specimen/Raleway)
- [Quicksand](https://fonts.google.com/specimen/Quicksand?query=quicksand)

As fontes são carregadas via `<link>` com `preconnect` no `<head>` para melhor performance:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&family=Quicksand:wght@300;400;700&display=swap"
  rel="stylesheet"
/>
```

*Para melhor orientação, assista ao vídeo de instruções do desafio, que está disponibilizado no Módulo 3 da Trilha de CSS.*

## 🌈 Demonstração

Você pode acessar ao resultado final do projeto [clicando aqui](https://micheleambrosio.github.io/hbomax/).

## 💻 Autora

![Michele Ambrosio](https://avatars.githubusercontent.com/u/55519539?v=4)

[Michele Queiroz Ambrosio](https://github.com/micheleambrosio)

[Instagram](http://instagram.com/programi_) · [GitHub](https://github.com/micheleambrosio) · [LinkedIn](https://www.linkedin.com/in/michele-ambrosio-a4899661/) · [Twitch](https://www.twitch.tv/michele_ambrosio)

---

⌨️ com ❤️ por [Michele Ambrosio](https://github.com/micheleambrosio) 😊
