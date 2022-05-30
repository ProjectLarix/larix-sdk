import {PublicKey} from "@solana/web3.js";
import {MarketConfig} from "./type";
export const MARKET = {
    main:{
        name:"main",
        programId:new PublicKey("7Zb1bGi32pfsrBkzWdqd4dFhUXwp5Nybr1zuaEwN34hy"),
        marketId:new PublicKey("5geyZJdffDBNoMqEbogbPvdgH9ue7NREobtW8M3C1qfe"),
        authorityId: new PublicKey("BxnUi6jyYbtEEgkBq4bPLKzDpSfWVAzgyf3TF2jfC1my"),
        larixOracleProgramId: new PublicKey("GMjBguH3ceg9wAHEMdY5iZnvzY6CgBACBDvkWmjR7upS"),
        mineMint:new PublicKey("Lrxqnh6ZHKbGy3dcrCED43nsoLkM1LTzU2jRfWe8qUC"),
        mineSupply:new PublicKey("HCUZ8TiRfFcXAwCMEeTrirfrGCB1jB2KAocTi1jbfHrd"),
        bridgeProgramId:new PublicKey("66TSa2MG2MMzYSesUAwKdf5SZ72wteTY1En1bzVNC9r1"),
        larixLookProgramId:new PublicKey("F96ZqjQ88f8cvXoJ2oK8x13BEagMBTXxhHP7PbJDBs2"),
        larixLookPoolId:new PublicKey("A9DHkJu6nMumnL7T9pbwMMkbzKi4pJAx2QjJL6XL2wsp"),
        reserves:[
            {
                name:"USDT",
                fullName:"USDT",
                reserveId: new PublicKey("DC832AzxQMGDaVLGiRQfRCkyXi6PUPjQyQfMbVRRjtKA"),
                larixOraclePriceId: new PublicKey("269apCw3MSNgFUeoW99hhAoAWyCArtDAAB39pzZYRdNx")
            },
            {
                name:"USDC",
                fullName:"USDC",
                reserveId: new PublicKey("Emq1qT9MyyB5eHfftF5thYme84hoEwh4TCjm31K2Xxif"),
                larixOraclePriceId: new PublicKey("7RhdnRymb4TqTYLM5bH7cALj86EZX2sFxH8KYUbhUmLB")
            },
            {
                name:"BTC",
                fullName:"BTC",
                reserveId: new PublicKey("9oxCAYbaien8bqjhsGpfVGEV32GJyQ8fSRMsPzczHTEb"),
                larixOraclePriceId: new PublicKey("9Hsq93xKsqeUf9b6PkiNDyr79BWphXPgxJ3KUoT4uLni")
            },
            {
                name:"soETH",
                fullName:"soETH",
                reserveId: new PublicKey("Egw1PCmsm3kAWnFtKFCJkTwi2EMfBi5P4Zfz6iURonFh"),
                larixOraclePriceId: new PublicKey("5KfiXEBkw745gSyEdmCJEbFEjVPqZCUDXgETycQrMA4n")
            },
            {
                name:"SOL",
                fullName:"SOL",
                reserveId: new PublicKey("2RcrbkGNcfy9mbarLCCRYdW3hxph7pSbP38x35MR2Bjt"),
                larixOraclePriceId: new PublicKey("4b48cC9RJwmLxGSPZGgPSh2qdQfwqzsxp2AZRyAdtHSo")
            },
            {
                name:"mSOL",
                fullName:"mSOL",
                reserveId: new PublicKey("GaX5diaQz7imMTeNYs5LPAHX6Hq1vKtxjBYzLkjXipMh"),
                larixOraclePriceId: new PublicKey("4b48cC9RJwmLxGSPZGgPSh2qdQfwqzsxp2AZRyAdtHSo")
            },
            {
                name:"soFTT",
                fullName:"soFTT",
                reserveId: new PublicKey("AwL4nHEPDKL7GW91czV4dUAp72kAwMBq1kBvexUYDBMm"),
                larixOraclePriceId: new PublicKey("14QSoduiLpjG74sN1CT5rLZPKafx5FaEgcFC2WRp2wK2")
            },
            {
                name:"SRM",
                fullName:"SRM",
                reserveId: new PublicKey("9xdoHwJr4tD2zj3QVpWrzafBKgLZUQWZ2UYPkqyAhQf6"),
                larixOraclePriceId: new PublicKey("41qU3QVbNvJGJHRYS8zfNUrPJBUPQNtQD4DgABuPCeVH")
            },
            {
                name:"RAY",
                fullName:"RAY",
                reserveId: new PublicKey("7PwLriJiW2hRdviqnCEAHwvL21kptG1gs4jrZPqr3uMf"),
                larixOraclePriceId: new PublicKey("GriuPR5KrTr64rfvVmvMcMdEbiynoNddfMT9BSdFZG2X")
            },
            {
                name:"ETH",
                fullName:"ETH",
                reserveId: new PublicKey("3GixAiDQgnCkMG6JDA1mxnDPHGjYkrNhWSYjLPzzN3Bs"),
                larixOraclePriceId: new PublicKey("5KfiXEBkw745gSyEdmCJEbFEjVPqZCUDXgETycQrMA4n")
            },
            {
                name:"stSOL",
                fullName:"stSOL",
                reserveId: new PublicKey("FStv7oj29DghUcCRDRJN9sEkB4uuh4SqWBY9pvSQ4Rch"),
                larixOraclePriceId: new PublicKey("4b48cC9RJwmLxGSPZGgPSh2qdQfwqzsxp2AZRyAdtHSo")
            },
            {
                name:"FTT",
                fullName:"FTT",
                reserveId: new PublicKey("ErwYs9UCVik6oLKTZgM5TYLMYU2JTVARVawwJKxMEqbp"),
                larixOraclePriceId: new PublicKey("14QSoduiLpjG74sN1CT5rLZPKafx5FaEgcFC2WRp2wK2")
            },
            {
                name:"UST",
                fullName:"UST(Wormhole)",
                reserveId: new PublicKey("4JZs57NTqFPJxNX4HpqjsF9oKtnZnK3fJ7jyuUhnnh6o"),
                larixOraclePriceId: new PublicKey("269apCw3MSNgFUeoW99hhAoAWyCArtDAAB39pzZYRdNx")
            }
        ],
        lpReserves:[
            {
                name:"mSOL-USDC",
                fullName:"Raydium mSOL-USDC",
                reserveId:new PublicKey("DmQn7amR56RdyztqgmdrHF3ZZt7GRUwZUZF4ysRq29Nd"),
                ammID:new PublicKey("ZfvDXXUhZDzDVsapffUyXHj9ByCoPjP4thL6YXcZ9ix"),
                lpMint:new PublicKey("4xTpJ4p76bAeggXoYywpCCNKfJspbuRzZ79R7pRhbqSf"),
                coinMintPrice:new PublicKey("4b48cC9RJwmLxGSPZGgPSh2qdQfwqzsxp2AZRyAdtHSo"),
                pcMintPrice:new PublicKey("7RhdnRymb4TqTYLM5bH7cALj86EZX2sFxH8KYUbhUmLB"),
                ammOpenOrders:new PublicKey("4zoatXFjMSirW2niUNhekxqeEZujjC1oioKCEJQMLeWF"),
                ammCoinMintSupply:new PublicKey("8JUjWjAyXTMB4ZXcV7nk3p6Gg1fWAAoSck7xekuyADKL"),
                ammPcMintSupply:new PublicKey("DaXyxj42ZDrp3mjrL9pYjPNyBp5P8A2f37am4Kd4EyrK"),
                farmPoolID:new PublicKey('DjtZxyFBgifzpaZEzfsWXogNX5zUCnTRXJqarGe9CiSv'),
                farmPoolLpSupply:new PublicKey("HUM5nLWT94iRQRQ7GSsjJ1DDWqWKhKfdGQCJCf7SypeD"),
                farmPoolProgramId:new PublicKey("9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z"),
                farmPoolAuthority:new PublicKey("AcTRjdD3x4ZHzKGaApVo2RdJ7Rm7f2kaheCiDEjSr1xe"),
                farmRewardVault:new PublicKey("A5W9spnyknywKui1vudnxUomdnebrZVUnjKW6BHgUdyz"),
                farmRewardVaultB:new PublicKey("JE9PvgvXMnVfBkCdwJU4id1w2BaxTuxheKKFdBfRiJZi"),
                rewardA:"",
                rewardB:"MNDE",
                version:5,
            },
            {
                name:"mSOL-USDT",
                fullName:"Raydium mSOL-USDT",
                reserveId:new PublicKey("8e3qLgXHdNYFNY5xcNTn34H9bRb1mhRJmRva6VwnpmWe"),
                ammID:new PublicKey("BhuMVCzwFVZMSuc1kBbdcAnXwFg9p4HJp7A9ddwYjsaF"),
                lpMint:new PublicKey("69NCmEW9mGpiWLjAcAWHq51k4ionJZmzgRfRT3wQaCCf"),
                coinMintPrice:new PublicKey("4b48cC9RJwmLxGSPZGgPSh2qdQfwqzsxp2AZRyAdtHSo"),
                pcMintPrice:new PublicKey("269apCw3MSNgFUeoW99hhAoAWyCArtDAAB39pzZYRdNx"),
                ammOpenOrders:new PublicKey("67xxC7oyzGFMVX8AaAHqcT3UWpPt4fMsHuoHrHvauhog"),
                ammCoinMintSupply:new PublicKey("FaoMKkKzMDQaURce1VLewT6K38F6FQS5UQXD1mTXJ2Cb"),
                ammPcMintSupply:new PublicKey("GE8m3rHHejrNf4jE96n5gzMmLbxTfPPcmv9Ppaw24FZa"),
                farmPoolID:new PublicKey('HxhxYASqdLcR6yehT9hB9HUpgcF1R2t9HtkHdngGZ2Dh'),
                farmPoolProgramId:new PublicKey("9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z"),
                farmPoolAuthority:new PublicKey("FGJKdv7Wm1j75cBsj7FsZU256fhDSYVTwYkzFQ3sVQqg"),
                farmPoolLpSupply:new PublicKey("CxY6pDZxPr8VAArC427NQficTpKEm3VxTVZEZQdQFexZ"),
                farmRewardVault:new PublicKey("94zGzNAzv2xU8YW3uHYkiysjG9Qw2gCv7wx9tye1uYbE"),
                farmRewardVaultB:new PublicKey("8mJzCGURgpUDLnB3qaSQt3xyM7MEKpPcvzXxWTGCQbTb"),
                rewardA:"",
                rewardB:"MNDE",
                version:5,
            },
            {
                name:"SOL-USDC",
                fullName:"Raydium SOL-USDC",
                reserveId:new PublicKey("7XbqSGrgrWfs2HErvGt3k9vHPBDGHRHSKtz5UxfK2DfH"),
                farmPoolID:new PublicKey('GUzaohfNuFbBqQTnPgPSNciv3aUvriXYjQduRE3ZkqFw'),
                ammID:new PublicKey("58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"),
                lpMint:new PublicKey("8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu"),
                coinMintPrice:new PublicKey("4b48cC9RJwmLxGSPZGgPSh2qdQfwqzsxp2AZRyAdtHSo"),
                pcMintPrice:new PublicKey("7RhdnRymb4TqTYLM5bH7cALj86EZX2sFxH8KYUbhUmLB"),
                ammOpenOrders:new PublicKey("HRk9CMrpq7Jn9sh7mzxE8CChHG8dneX9p475QKz4Fsfc"),
                ammCoinMintSupply:new PublicKey("DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz"),
                ammPcMintSupply:new PublicKey("HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz"),
                farmPoolProgramId:new PublicKey("9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z"),
                farmPoolAuthority:new PublicKey("DgbCWnbXg43nmeiAveMCkUUPEpAr3rZo3iop3TyP6S63"),
                farmPoolLpSupply:new PublicKey("J6ECnRDZEXcxuruvErXDWsPZn9czowKynUr9eDSQ4QeN"),
                farmRewardVault:new PublicKey("38YS2N7VUb856QDsXHS1h8zv5556YgEy9zKbbL2mefjf"),
                farmRewardVaultB:new PublicKey("ANDJUfDryy3jY6DngwGRXVyxCJBT5JfojLDXwZYSpnEL"),
                rewardA:"RAY",
                rewardB:"",
                version:5,
            },
            {
                name:"RAY-SOL",
                fullName:"Raydium RAY-SOL",
                reserveId:new PublicKey("9ceTcxt18KiZyqXJDqDBiZSbm2iPhGjLwXKnHZYZiF87"),
                farmPoolID:new PublicKey('HUDr9BDaAGqi37xbQHzxCyXvfMCKPTPNF8g9c9bPu1Fu'),
                ammID:new PublicKey("AVs9TA4nWDzfPJE9gGVNJMVhcQy3V9PGazuz33BfG2RA"),
                lpMint:new PublicKey("89ZKE4aoyfLBe2RuV6jM3JGNhaV18Nxh8eNtjRcndBip"),
                coinMintPrice:new PublicKey("GriuPR5KrTr64rfvVmvMcMdEbiynoNddfMT9BSdFZG2X"),
                pcMintPrice:new PublicKey("4b48cC9RJwmLxGSPZGgPSh2qdQfwqzsxp2AZRyAdtHSo"),
                ammOpenOrders:new PublicKey("6Su6Ea97dBxecd5W92KcVvv6SzCurE2BXGgFe9LNGMpE"),
                ammCoinMintSupply:new PublicKey("Em6rHi68trYgBFyJ5261A2nhwuQWfLcirgzZZYoRcrkX"),
                ammPcMintSupply:new PublicKey("3mEFzHsJyu2Cpjrz6zPmTzP7uoLFj9SbbecGVzzkL1mJ"),
                farmPoolProgramId:new PublicKey("EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q"),
                farmPoolAuthority:new PublicKey("9VbmvaaPeNAke2MAL3h2Fw82VubH1tBCzwBzaWybGKiG"),
                farmPoolLpSupply:new PublicKey("A4xQv2BQPB1WxsjiCC7tcMH7zUq255uCBkevFj8qSCyJ"),
                farmRewardVault:new PublicKey("6zA5RAQYgazm4dniS8AigjGFtRi4xneqjL7ehrSqCmhr"),
                farmRewardVaultB:new PublicKey("6zA5RAQYgazm4dniS8AigjGFtRi4xneqjL7ehrSqCmhr"),
                rewardA:"",
                rewardB:"RAY",
                version:3,
            },
            {
                name:"SOL-USDT",
                fullName:"Raydium SOL-USDT",
                reserveId:new PublicKey("AbPtGMVG2XpC7cxqW5hWR6EnaTqKnfpYbzpxeKAmLEUr"),

                ammID:new PublicKey("7XawhbbxtsRcQA8KTkHT9f9nc6d69UwqCDh6U5EEbEmX"),
                lpMint:new PublicKey("Epm4KfTj4DMrvqn6Bwg2Tr2N8vhQuNbuK8bESFp4k33K"),
                coinMintPrice:new PublicKey("4b48cC9RJwmLxGSPZGgPSh2qdQfwqzsxp2AZRyAdtHSo"),
                pcMintPrice:new PublicKey("269apCw3MSNgFUeoW99hhAoAWyCArtDAAB39pzZYRdNx"),
                ammOpenOrders:new PublicKey("4NJVwEAoudfSvU5kdxKm5DsQe4AAqG6XxpZcNdQVinS4"),
                ammCoinMintSupply:new PublicKey("876Z9waBygfzUrwwKFfnRcc7cfY4EQf6Kz1w7GRgbVYW"),
                ammPcMintSupply:new PublicKey("CB86HtaqpXbNWbq67L18y5x2RhqoJ6smb7xHUcyWdQAQ"),
                farmPoolID:new PublicKey('5r878BSWPtoXgnqaeFJi7BCycKZ5CodBB2vS9SeiV8q'),
                farmPoolProgramId:new PublicKey("9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z"),
                farmPoolAuthority:new PublicKey("DimG1WK9N7NdbhddweGTDDBRaBdCmcbPtoWZJ4Fi4rn4"),
                farmPoolLpSupply:new PublicKey("jfhZy3B6sqeu95z71GukkxpkDtfHXJiFAMULM6STWxb"),
                farmRewardVault:new PublicKey("Bgj3meVYds8ficJc9xntbjmMBPVUuyn6CvDUm1AD39yq"),
                farmRewardVaultB:new PublicKey("DJifNDjNt7iHbkNHs9V6Wm5pdiuddtF9w3o4WEiraKrP"),
                rewardA:"RAY",
                rewardB:"",
                version:5,
            },
            {
                name:"RAY-soETH",
                fullName:"Raydium RAY-soETH",
                reserveId:new PublicKey("By2vzoMtUjtziiUZkBd4V5pwFNKeEz4XeZsBXBLGPtoL"),

                ammID:new PublicKey("8iQFhWyceGREsWnLM8NkG9GC8DvZunGZyMzuyUScgkMK"),
                lpMint:new PublicKey("mjQH33MqZv5aKAbKHi8dG3g3qXeRQqq1GFcXceZkNSr"),
                coinMintPrice:new PublicKey("GriuPR5KrTr64rfvVmvMcMdEbiynoNddfMT9BSdFZG2X"),
                pcMintPrice:new PublicKey("5KfiXEBkw745gSyEdmCJEbFEjVPqZCUDXgETycQrMA4n"),
                ammOpenOrders:new PublicKey("7iztHknuo7FAXVrrpAjsHBEEjRTaNH4b3hecVApQnSwN"),
                ammCoinMintSupply:new PublicKey("G3Szi8fUqxfZjZoNx17kQbxeMTyXt2ieRvju4f3eJt9j"),
                ammPcMintSupply:new PublicKey("7MgaPPNa7ySdu5XV7ik29Xoav4qcDk4wznXZ2Muq9MnT"),
                farmPoolID:new PublicKey('B6fbnZZ7sbKHR18ffEDD5Nncgp54iKN1GbCgjTRdqhS1'),
                farmPoolProgramId:new PublicKey("EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q"),
                farmPoolAuthority:new PublicKey("6amoZ7YBbsz3uUUbkeEH4vDTNwjvgjxTiu6nGi9z1JGe"),
                farmPoolLpSupply:new PublicKey("BjAfXpHTHz2kipraNddS6WwQvGGtbvyobn7MxLEEYfrH"),
                farmRewardVault:new PublicKey("7YfTgYQFGEJ4kb8jCF8cBrrUwEFskLin3EbvE1crqiQh"),
                farmRewardVaultB:new PublicKey("7YfTgYQFGEJ4kb8jCF8cBrrUwEFskLin3EbvE1crqiQh"),
                rewardA:"",
                rewardB:"RAY",
                version:3,
            },
            {
                name:"RAY-USDC",
                fullName:"Raydium RAY-USDC",
                reserveId:new PublicKey("EJkTqpmUMhvuiirfed1TjArZJvzUiC6Nq3rkRWXvJtuh"),

                ammID:new PublicKey("6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg"),
                lpMint:new PublicKey("FbC6K13MzHvN42bXrtGaWsvZY9fxrackRSZcBGfjPc7m"),
                coinMintPrice:new PublicKey("GriuPR5KrTr64rfvVmvMcMdEbiynoNddfMT9BSdFZG2X"),
                pcMintPrice:new PublicKey("7RhdnRymb4TqTYLM5bH7cALj86EZX2sFxH8KYUbhUmLB"),
                ammOpenOrders:new PublicKey("J8u8nTHYtvudyqwLrXZboziN95LpaHFHpd97Jm5vtbkW"),
                ammCoinMintSupply:new PublicKey("FdmKUE4UMiJYFK5ogCngHzShuVKrFXBamPWcewDr31th"),
                ammPcMintSupply:new PublicKey("Eqrhxd7bDUCH3MepKmdVkgwazXRzY6iHhEoBpY7yAohk"),
                farmPoolID:new PublicKey('CHYrUBX2RKX8iBg7gYTkccoGNBzP44LdaazMHCLcdEgS'),
                farmPoolProgramId:new PublicKey("EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q"),
                farmPoolAuthority:new PublicKey("5KQFnDd33J5NaMC9hQ64P5XzaaSz8Pt7NBCkZFYn1po"),
                farmPoolLpSupply:new PublicKey("BNnXLFGva3K8ACruAc1gaP49NCbLkyE6xWhGV4G2HLrs"),
                farmRewardVault:new PublicKey("DpRueBHHhrQNvrjZX7CwGitJDJ8eZc3AHcyFMG4LqCQR"),
                farmRewardVaultB:new PublicKey("DpRueBHHhrQNvrjZX7CwGitJDJ8eZc3AHcyFMG4LqCQR"),
                rewardA:"",
                rewardB:"RAY",
                version:3,
            },
            {
                name:"RAY-USDT",
                fullName:"Raydium RAY-USDT",
                reserveId:new PublicKey("43rjwD7obASwjPjCvG8W1vUjkwhAbA95zc2eMa5itDKq"),

                ammID:new PublicKey("DVa7Qmb5ct9RCpaU7UTpSaf3GVMYz17vNVU67XpdCRut"),
                lpMint:new PublicKey("C3sT1R3nsw4AVdepvLTLKr5Gvszr7jufyBWUCvy4TUvT"),
                coinMintPrice:new PublicKey("GriuPR5KrTr64rfvVmvMcMdEbiynoNddfMT9BSdFZG2X"),
                pcMintPrice:new PublicKey("269apCw3MSNgFUeoW99hhAoAWyCArtDAAB39pzZYRdNx"),
                ammOpenOrders:new PublicKey("7UF3m8hDGZ6bNnHzaT2YHrhp7A7n9qFfBj6QEpHPv5S8"),
                ammCoinMintSupply:new PublicKey("3wqhzSB9avepM9xMteiZnbJw75zmTBDVmPFLTQAGcSMN"),
                ammPcMintSupply:new PublicKey("5GtSbKJEPaoumrDzNj4kGkgZtfDyUceKaHrPziazALC1"),
                farmPoolID:new PublicKey('AvbVWpBi2e4C9HPmZgShGdPoNydG4Yw8GJvG9HUcLgce'),
                farmPoolProgramId:new PublicKey("EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q"),
                farmPoolAuthority:new PublicKey("8JYVFy3pYsPSpPRsqf43KSJFnJzn83nnRLQgG88XKB8q"),
                farmPoolLpSupply:new PublicKey("4u4AnMBHXehdpP5tbD6qzB5Q4iZmvKKR5aUr2gavG7aw"),
                farmRewardVault:new PublicKey("HCHNuGzkqSnw9TbwpPv1gTnoqnqYepcojHw9DAToBrUj"),
                farmRewardVaultB:new PublicKey("HCHNuGzkqSnw9TbwpPv1gTnoqnqYepcojHw9DAToBrUj"),
                rewardA:"",
                rewardB:"RAY",
                version:3,
            },
            {
                name:"ETH-SOL",
                fullName:"Raydium ETH-SOL",
                reserveId:new PublicKey("FRdb6Q7Mr8dfyjSZMuH9pDEZhHJW2KznhacTSJkxkQjP"),
                ammID:new PublicKey("4yrHms7ekgTBgJg77zJ33TsWrraqHsCXDtuSZqUsuGHb"),
                lpMint:new PublicKey("3hbozt2Por7bcrGod8N7kEeJNMocFFjCJrQR16TQGBrE"),
                coinMintPrice:new PublicKey("5KfiXEBkw745gSyEdmCJEbFEjVPqZCUDXgETycQrMA4n"),
                pcMintPrice:new PublicKey("4b48cC9RJwmLxGSPZGgPSh2qdQfwqzsxp2AZRyAdtHSo"),
                ammOpenOrders:new PublicKey("FBU5FSjYeEZTbbLAjPCfkcDKJpAKtHVQUwL6zDgnNGRF"),
                ammCoinMintSupply:new PublicKey("5ushog8nHpHmYVJVfEs3NXqPJpne21sVZNuK3vqm8Gdg"),
                ammPcMintSupply:new PublicKey("CWGyCCMC7xmWJZgAynhfAG7vSdYoJcmh27FMwVPsGuq5"),
                farmPoolID:new PublicKey('Gi3Z6TXeH1ZhCCbwg6oJL8SE4LcmxmGRNhhfA6NZhwTK'),
                farmPoolProgramId:new PublicKey("9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z"),
                farmPoolAuthority:new PublicKey("HoUqzaqKTueo1DMcVcTUgnc79uoiF5nRoD2iNGrVhkei"),
                farmPoolLpSupply:new PublicKey("9cTdfPLSkauS8Ys848Wz4pjfFvQjsmJpVTUnYXffkubb"),
                farmRewardVault:new PublicKey("2MMFGZGEjQRovNeNtj1xN9redsVLYTMVcXzFTLQCw6ue"),
                farmRewardVaultB:new PublicKey("6DhjnWKLbxnDSFZApaVJXCY2wbzgt2mYhvW3yBreaYsY"),
                rewardA:"RAY",
                rewardB:"",
                version:5,
            },
            {
                name:"ETH-USDC",
                fullName:"Raydium ETH-USDC",
                reserveId:new PublicKey("FKyqkYFmFAEkPhEf6WMFrKuNVpPMYRDVc4fvjheD15o"),
                ammID:new PublicKey("EoNrn8iUhwgJySD1pHu8Qxm5gSQqLK3za4m8xzD2RuEb"),
                lpMint:new PublicKey("3529SBnMCDW3S3xQ52aABbRHo7PcHvpQA4no8J12L5eK"),
                coinMintPrice:new PublicKey("5KfiXEBkw745gSyEdmCJEbFEjVPqZCUDXgETycQrMA4n"),
                pcMintPrice:new PublicKey("7RhdnRymb4TqTYLM5bH7cALj86EZX2sFxH8KYUbhUmLB"),
                ammOpenOrders:new PublicKey("6iwDsRGaQucEcfXX8TgDW1eyTfxLAGrypxdMJ5uqoYcp"),
                ammCoinMintSupply:new PublicKey("DVWRhoXKCoRbvC5QUeTECRNyUSU1gwUM48dBMDSZ88U"),
                ammPcMintSupply:new PublicKey("HftKFJJcUTu6xYcS75cDkm3y8HEkGgutcbGsdREDWdMr"),
                farmPoolID:new PublicKey('8JJSdD1ca5SDtGCEm3yBbQKek2FvJ1EbNt9q2ET3E9Jt'),
                farmPoolProgramId:new PublicKey("9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z"),
                farmPoolAuthority:new PublicKey("DBoKA7VTfnQDj7knPTrZcg6KKs5WhsKsVRFVjBsjyobs"),
                farmPoolLpSupply:new PublicKey("2ucKrVxYYCfWC6yRk3R7fRbQ5Mjz81ciEgS451TGq2hg"),
                farmRewardVault:new PublicKey("3nhoDqudHBBedE9CuUqnydrWWiMFLKcZf3Ydc9zbAFet"),
                farmRewardVaultB:new PublicKey("B4LA1grBYY9CE3W8sG9asR7Pi2a6eSt2A8RHcXXKJ1UM"),
                rewardA:"RAY",
                rewardB:"",
                version:5,
            }
        ]
    },
    bonfida:{
        name:"bonfida",
        programId:new PublicKey("3cKREQ3Z7ioCQ4oa23uGEuzekhQWPxKiBEZ87WfaAZ5p"),
        marketId: new PublicKey("5enDUZdptakV39Sra9QQYBstJbLVZHHqT74CgeL2fMqV"),
        authorityId: new PublicKey("3CUxD14BycC4a4K4xPcgU7okw9RwP6vhkycp3umxfyzZ"),
        larixOracleProgramId: new PublicKey("GMjBguH3ceg9wAHEMdY5iZnvzY6CgBACBDvkWmjR7upS"),
        mineSupply: new PublicKey("7R5YVRUqviwQTah8WSHHGehwwwaiiq72N4YSdTbE1bNw"),
        mineMint: new PublicKey("Lrxqnh6ZHKbGy3dcrCED43nsoLkM1LTzU2jRfWe8qUC"),
        reserves: [
            {
                name:"USDC",
                fullName:"USDC",
                reserveId: new PublicKey("6P4bZnbS8oSCsdUkK6zQCHfSAW9aREFF5F7k61rS4noP"),
                larixOraclePriceId: new PublicKey("7RhdnRymb4TqTYLM5bH7cALj86EZX2sFxH8KYUbhUmLB")
            },
            {
                name:"SOL",
                fullName:"SOL",
                reserveId: new PublicKey("DNAPex89vUaAQaxQPY35UsYuCTfcp79V9Zvo6moQCk2G"),
                larixOraclePriceId: new PublicKey("4b48cC9RJwmLxGSPZGgPSh2qdQfwqzsxp2AZRyAdtHSo")
            },
            {
                name:"FIDA",
                fullName:"FIDA",
                reserveId: new PublicKey("7tZw5xc2GzXttdgEW4Rj2d3MHm7izt9ceZGugGgnSKBS"),
                larixOraclePriceId: new PublicKey("Egd8AetAEVsLSQNXLYXQN2uLp5txX623WME5reC4phGP")
            },
        ]
    },
    xsol:{
        name:"xSOL",
        programId:new PublicKey("3cKREQ3Z7ioCQ4oa23uGEuzekhQWPxKiBEZ87WfaAZ5p"),
        marketId: new PublicKey("Cc5BGXYUFRpg9sy16WpwYaB6y82Yp6obhNbA55pCC4ZS"),
        authorityId: new PublicKey("BAcibEajCkdezp5zzQ7nDQG2t4DP6XGqzrDRbabjT5gZ"),
        larixOracleProgramId: new PublicKey("HttDgr1KeUVBoUGMm8rUdG8PzHLwETPLSnvjAXGzRASN"),
        mineSupply: new PublicKey("GmZyeT385ycdFHBDZTKh92GxuQRuSjL8iSnH3HwfDsUx"),
        mineMint: new PublicKey("Lrxqnh6ZHKbGy3dcrCED43nsoLkM1LTzU2jRfWe8qUC"),
        reserves: [
            {
                name:"SOL",
                fullName:"SOL",
                reserveId: new PublicKey("C8guibu4yK6wpsRrwsvMZdch8EmCUvFVN1CqBaMbY93i"),
                larixOraclePriceId: new PublicKey("5zteFsz64YENeZZ7u3ChZqzzS6PCw4HpSSQbY8HNGviG")
            },
            {
                name:"mSOL",
                fullName:"mSOL",
                reserveId: new PublicKey("9uLHNUTVqKC5dvJX6yeZxvPTJP3MDqnTVmiCtUS7xKgn"),
                larixOraclePriceId: new PublicKey("97fx6Vi4TCjuF3oLATP9Ta9rzgthrWUWvjzpiMqAoFVn")
            },
            {
                name:"stSOL",
                fullName:"stSOL",
                reserveId: new PublicKey("GtdzcR7Um1oejq9hSkMZeX4C3kcu69MBLrfLiy88oQ35"),
                larixOraclePriceId: new PublicKey("HDKMFfcCZKKjbDmRKGSJUA5TzKDNquaZmN8Yk1u8tfCR")
            },
            {
                name:"scnSOL",
                fullName:"scnSOL",
                reserveId: new PublicKey("G2tDWNmFqCqpBiQKadGBRvvKUo89KBa9ZK532USbnsLh"),
                larixOraclePriceId: new PublicKey("Eke188zQ2vMNcFqRot48zpHykiKPYyiupqYhf7ehkzZK")
            },
            {
                name:"JSOL",
                fullName:"JSOL",
                reserveId: new PublicKey("4gKbprgcKaZqNbjMPg7JQiRXDG73YbGvGdiP1oPPBgt4"),
                larixOraclePriceId: new PublicKey("DwNZxGwmfVVrnvANmeSyzQrTxcyPHK48S3N2R9rTw78i")
            },
        ]
    },
    larix:{
        name:"larix",
        programId:new PublicKey("3cKREQ3Z7ioCQ4oa23uGEuzekhQWPxKiBEZ87WfaAZ5p"),
        marketId: new PublicKey("5abm8NyiDikUaG262iEr76UE8X7M9UsmqgZW2ouNLNDZ"),
        authorityId: new PublicKey("GvQRoLVCjyEz31FHvVEyCm5ZMzPManV8ozNoH22vjTnS"),
        larixOracleProgramId: new PublicKey("HttDgr1KeUVBoUGMm8rUdG8PzHLwETPLSnvjAXGzRASN"),
        mineSupply: new PublicKey("BJCGgkNqYmAEM1YB7vGpmfMKHGg5MDjr3AhvSXeCRWPf"),
        mineMint: new PublicKey("Lrxqnh6ZHKbGy3dcrCED43nsoLkM1LTzU2jRfWe8qUC"),
        reserves: [
            {
                name:"SOL",
                fullName:"SOL",
                reserveId: new PublicKey("DYpnhtEzZ926CY52yiQCrffEFX2S8HP5xfzFV2A3UGmQ"),
                larixOraclePriceId: new PublicKey("5zteFsz64YENeZZ7u3ChZqzzS6PCw4HpSSQbY8HNGviG")
            },
            {
                name:"USDT",
                fullName:"USDT",
                reserveId: new PublicKey("DbCHKCVni4zHnqZhYdN7eX6yeZFkzFiy78GcCPuJgUZM"),
                larixOraclePriceId: new PublicKey("3xyx7B1yWJi7U3YxVKMP2X8Fyb7rEuwdca6cg6aaostZ")
            },
            {
                name:"USDC",
                fullName:"USDC",
                reserveId: new PublicKey("2PBga1saLhiM9S4ct5z6Gk99TwTFN68hMLBHMF3K9kLe"),
                larixOraclePriceId: new PublicKey("9iS4z29Bu5ppZ3ovt4kBZRSEhBDwPpaQ5fU4AnzqPty6")
            },
            {
                name:"LARIX",
                fullName:"LARIX",
                reserveId: new PublicKey("CWG9SQdc49Aa5aXpzBYmnA4Kroh4x2pbSktSy4vfwb9h"),
                larixOraclePriceId: new PublicKey("5vp2S6JZTDw9u9XAQ4KgESi8527wheGgXa9QwQU8FfxN")
            },
        ]
    },
    stepn:{
        name:"stepn",
        programId:new PublicKey("3cKREQ3Z7ioCQ4oa23uGEuzekhQWPxKiBEZ87WfaAZ5p"),
        marketId: new PublicKey("DRcWrCAKxSoew1YPjNPs8XduiPxS9FCMimsC7VkQwKfj"),
        authorityId: new PublicKey("3RbdqF1963JhAiauWSxn9H4gaP4wqXUbhveY1d7HFq6m"),
        larixOracleProgramId: new PublicKey("HttDgr1KeUVBoUGMm8rUdG8PzHLwETPLSnvjAXGzRASN"),
        mineSupply: new PublicKey("E6WEqX7TGf1RUb7h4Gh11tziSqKSX6t1t1ppFzZUAGps"),
        mineMint: new PublicKey("Lrxqnh6ZHKbGy3dcrCED43nsoLkM1LTzU2jRfWe8qUC"),
        reserves: [
            {
                name:"GMT",
                fullName:"GMT",
                reserveId: new PublicKey("59FqQLRwnWbGxjvN3XSj2pDfUVEbVjBkPY2uYMuhaE1t"),
                larixOraclePriceId: new PublicKey("D6SQfBTWrrsy7eq37t1b2YKRtM5RJx4VXJ4opi5VvBM4")
            },
            {
                name:"GST",
                fullName:"GST",
                reserveId: new PublicKey("FxMF1CvH9U5jMq5MjMYRRvznHbdTRsboohpd7Ahem7AF"),
                larixOraclePriceId: new PublicKey("CktBJzgdpPh3q4xyFKSYsHqkw9YDhzrsRFvm9Y2BjKVC")
            },
            {
                name:"SOL",
                fullName:"SOL",
                reserveId: new PublicKey("9t35aQDJF28eVFdsRXLNYtynqsho97SXYmNt58haTJDC"),
                larixOraclePriceId: new PublicKey("5zteFsz64YENeZZ7u3ChZqzzS6PCw4HpSSQbY8HNGviG")
            },
            {
                name:"mSOL",
                fullName:"mSOL",
                reserveId: new PublicKey("8VtdcJrU5gpLZvDxvsaxTtrJX6ayrpeDA6XUZmQ77piF"),
                larixOraclePriceId: new PublicKey("97fx6Vi4TCjuF3oLATP9Ta9rzgthrWUWvjzpiMqAoFVn")
            },
            {
                name:"USDC",
                fullName:"USDC",
                reserveId: new PublicKey("G5ibSTvLmumdkcLr7AknxFCyDBp5ciLKAbSTkpy2Vyga"),
                larixOraclePriceId: new PublicKey("9iS4z29Bu5ppZ3ovt4kBZRSEhBDwPpaQ5fU4AnzqPty6")
            },

        ]
    },
    step: {
        name:"step",
        programId:new PublicKey("3cKREQ3Z7ioCQ4oa23uGEuzekhQWPxKiBEZ87WfaAZ5p"),
        marketId: new PublicKey("3kKjWexdb97MvYVrUmPRYUUaLgzPdPcThAgFnLtXo8Uw"),
        authorityId: new PublicKey("9cpToWbpign2gpdPcBitZs8SiSpkNEPxQ9UxTcsSaZcs"),
        larixOracleProgramId: new PublicKey("HttDgr1KeUVBoUGMm8rUdG8PzHLwETPLSnvjAXGzRASN"),
        mineSupply: new PublicKey("GdLh2dSm6zusuPWUa9RsQGyZRqZQpBAr4ALysxBn1HYK"),
        mineMint: new PublicKey("Lrxqnh6ZHKbGy3dcrCED43nsoLkM1LTzU2jRfWe8qUC"),
        reserves: [
            {
                name:"STEP",
                fullName:"STEP",
                reserveId: new PublicKey("6Wdx7he4sHkFzu1gftovJi9LUjFt9oBsxsycgbqHqXPL"),
                larixOraclePriceId: new PublicKey("CuXtHKnkSJFCZJZAujzYMQ9gRayHCHCyb7rmam1tK5Fc")
            },
            {
                name:"SOL",
                fullName:"SOL",
                reserveId: new PublicKey("99Ngo1nc22ugXEQKck1rRMWNsv9pRgVjHupxoszFMway"),
                larixOraclePriceId: new PublicKey("5zteFsz64YENeZZ7u3ChZqzzS6PCw4HpSSQbY8HNGviG")
            },
            {
                name:"mSOL",
                fullName:"mSOL",
                reserveId: new PublicKey("gjGqrDhfT7sWxs2x8QG2yvNUwRuAhpZeLHwTxYWLbn1"),
                larixOraclePriceId: new PublicKey("97fx6Vi4TCjuF3oLATP9Ta9rzgthrWUWvjzpiMqAoFVn")
            },
            {
                name:"USDC",
                fullName:"USDC",
                reserveId: new PublicKey("8bSYH8GtoAG2oqSJgy3P3LmXdhi3rEhcxM4ydxEsb7FQ"),
                larixOraclePriceId: new PublicKey("9iS4z29Bu5ppZ3ovt4kBZRSEhBDwPpaQ5fU4AnzqPty6")
            },
        ]
    },
}

export const MARKETS:MarketConfig[] =[
    MARKET.main,
    MARKET.bonfida,
    MARKET.xsol,
    MARKET.larix,
    MARKET.step,
    MARKET.stepn
]